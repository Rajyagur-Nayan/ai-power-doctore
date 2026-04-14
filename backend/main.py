import os
import math
import httpx
import base64
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from datetime import datetime
import google.generativeai as genai

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
import httpx
import math


# Load environment variables early
load_dotenv()

# Local imports
from database import engine, Base, get_db
from models import Profile, MedicalHistory, Consultation, Prescription
from routes.voice import router as voice_router
from routes.healthcare import router as healthcare_router
from routes.meeting import router as meeting_router

app = FastAPI(title="Rural Health Assistant API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(voice_router)
app.include_router(healthcare_router)
app.include_router(meeting_router, prefix="/meeting", tags=["Meeting"])

# Initialize AI Clients
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

# Initialize Gemini for Vision Analysis
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)


# --- DATABASE INIT ---
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Placeholder for startup routines

# --- AI PROMPTS ---

TEXT_CHAT_PROMPT = """You are a senior rural healthcare assistant. Provide professional, empathetic guidance strictly in Hindi (Devanagari script).
RULES:
1. Provide clear, supportive advice for symptoms.
2. STRICTLY NO MEDICAL DIAGNOSIS. Instead, use 'This could be...' or 'Commonly these symptoms mean...'
3. If EMERGENCY (chest pain, heavy bleeding, accident), tell them to go to the HOSPITAL IMMEDIATELY in bold Hindi.
4. For minor issues, suggest home care (hydration, rest) and visiting a local doctor.
5. Keep the response VERY SHORT, concise, and strictly in POINT-WISE format (bullet points) in Hindi."""

VOICE_CHAT_PROMPT = """You are a concise voice assistant. Use simple, clear Hindi (Devanagari script). 
RULES: 
1. Maximum 1 short sentence in Hindi. 
2. Be direct and clear for audio playback. 
3. If emergency, say ONLY 'कृपया तुरंत अस्पताल जाएं।' (Please go to the hospital immediately in Hindi)."""

MEDIC_PROMPT = """You are a safe medical advisor for Over-The-Counter (OTC) medication. Provide all advice strictly in Hindi (Devanagari script).
RULES:
1. ONLY suggest basic OTC medicines (e.g., Paracetamol for fever, Cetirizine for allergies, ORS for dehydration).
2. NEVER suggest prescription-only antibiotics, steroids, or heavy sedatives.
3. ALWAYS include a clear safety warning in Hindi: 'किसी भी दवा को लेने से पहले स्थानीय डॉक्टर या फार्मासिस्ट से सलाह लें।'
4. If symptoms sound severe, DO NOT suggest medicine; instead, recommend immediate clinical consultation in Hindi.
5. Provide simple dosage for adults only in Hindi."""

VISION_PROMPT = """You are a specialized AI Vision assistant for biological image analysis (skin conditions, rashes, or wounds). Provide all analysis and advice strictly in Hindi (Devanagari script).
RULES:
1. Describe exactly what you see in the image in Hindi.
2. Suggest possible conditions in Hindi.
3. Provide immediate first-aid or care advice in Hindi.
4. MANDATORY: You MUST include this bold warning in Hindi: '**अस्वीकरण: यह एक एआई-जनरेटेड विश्लेषण है और नैदानिक ​​​​निदान नहीं है। कृपया तुरंत एक लाइसेंस प्राप्त चिकित्सा पेशेवर से परामर्श लें।**'
5. If the wound looks severe, urge them to seek emergency care immediately in Hindi."""

# --- PYDANTIC SCHEMAS ---

class ChatRequest(BaseModel):
    message: str

class SmartHospitalRequest(BaseModel):
    text: str
    lat: float
    lng: float
    category: Optional[str] = "All"

class AppointmentRequest(BaseModel):
    patient_name: str
    hospital_name: str
    specialty: Optional[str] = None
    appointment_date: str
    appointment_time: str
    reason: Optional[str] = None

class ProfileSchema(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    weight: Optional[float] = None
    health_info: Optional[str] = None

    class Config:
        from_attributes = True

class HistorySchema(BaseModel):
    id: Optional[int] = None
    title: str
    content: str
    category: str = "General"
    timestamp: Optional[datetime] = None

    class Config:
        from_attributes = True

class ConsultationSchema(BaseModel):
    id: Optional[int] = None
    patient_name: str
    symptoms: Optional[str] = None
    status: str = "Pending"
    earnings: float = 0.0
    timestamp: Optional[datetime] = None

    class Config:
        from_attributes = True

class PrescriptionSchema(BaseModel):
    consultation_id: int
    medication_details: str

# --- ENDPOINTS ---

@app.post("/chat")
async def chat(request: ChatRequest, db: AsyncSession = Depends(get_db)):
    if not client: raise HTTPException(status_code=500, detail="Groq API not initialized.")
    completion = client.chat.completions.create(model="llama-3.3-70b-versatile", messages=[{"role": "system", "content": TEXT_CHAT_PROMPT}, {"role": "user", "content": request.message}], temperature=0.6)
    response_text = completion.choices[0].message.content
    db.add(MedicalHistory(title=f"Chat: {request.message[:20]}...", content=f"User: {request.message}\nAI: {response_text}", category="General"))
    await db.commit()
    return {"response": response_text}

@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    """
    Analyzes medical images specifically via Gemini 1.5 Flash.
    """
    try:
        if not GEMINI_API_KEY:
            raise HTTPException(status_code=503, detail="Gemini API Key missing.")

        # Read and validate
        contents = await file.read()
        if len(contents) > 5 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large (Max 5MB).")

        # Gemini Analysis
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content([
            f"{VISION_PROMPT}\n\nAnalyze this safely.",
            {"mime_type": file.content_type, "data": contents}
        ])

        if not response.text:
            raise Exception("Empty interpretation received.")

        response_text = response.text
        
        # Save results
        db.add(MedicalHistory(title="AI Image Diagnosis", content=response_text, category="Consultation"))
        await db.commit()
        
        return {"response": response_text}
    except Exception as e:
        print(f"Vision Error: {e}")
        return {"response": "**Notice:** AI Vision uplink is currently unstable. Please re-upload or consult a physician directly."}

@app.post("/medication-advice")
async def medication_advice(request: ChatRequest, db: AsyncSession = Depends(get_db)):
    """
    Provides safe OTC medication advice using clinical guardrails.
    """
    if not client: 
        raise HTTPException(status_code=500, detail="Groq API not initialized.")
    
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile", 
            messages=[
                {"role": "system", "content": MEDIC_PROMPT}, 
                {"role": "user", "content": request.message}
            ], 
            temperature=0.3
        )
        response_text = completion.choices[0].message.content
        
        # Logging for clinical history
        db.add(MedicalHistory(
            title=f"Medication: {request.message[:20]}...", 
            content=f"Request: {request.message}\nAdvice: {response_text}", 
            category="Medication"
        ))
        await db.commit()
        return {"response": response_text}
    except Exception as e:
        print(f"Medication Error: {e}")
        return {"response": "Sorry, I'm having trouble processing medication advice right now. Please consult a doctor."}

@app.post("/voice")
async def voice_chat(request: ChatRequest, db: AsyncSession = Depends(get_db)):
    """
    Handles clinical voice-to-text queries with rapid AI responses.
    """
    if not client: 
        raise HTTPException(status_code=500, detail="Groq API not initialized.")
    
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile", 
            messages=[
                {"role": "system", "content": VOICE_CHAT_PROMPT}, 
                {"role": "user", "content": request.message}
            ], 
            max_tokens=150,
            temperature=0.5
        )
        response_text = completion.choices[0].message.content
        
        # Clinical Logging
        db.add(MedicalHistory(
            title=f"Voice Query: {request.message[:20]}...", 
            content=f"Vocal Input: {request.message}\nMatrix Response: {response_text}", 
            category="Emergency" if "hospital" in response_text.lower() else "General"
        ))
        await db.commit()
        
        return {"response": response_text}
    except Exception as e:
        print(f"Voice Server Error: {e}")
        raise HTTPException(status_code=500, detail="Vocal processing pipeline failure.")

# --- DOCTOR DASHBOARD ENDPOINTS ---

@app.get("/consultations/queue", response_model=List[ConsultationSchema])
async def get_queue(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Consultation).filter(Consultation.status != "Completed").order_by(Consultation.timestamp.asc()))
    return result.scalars().all()

@app.post("/consultations/{id}/start")
async def start_consultation(id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Consultation).filter(Consultation.id == id))
    consultation = result.scalars().first()
    if not consultation: raise HTTPException(status_code=404, detail="Session lost.")
    consultation.status = "Active"
    await db.commit()
    return {"status": "Active"}

@app.post("/prescriptions")
async def issue_prescription(request: PrescriptionSchema, db: AsyncSession = Depends(get_db)):
    # Save prescription
    db.add(Prescription(consultation_id=request.consultation_id, medication_details=request.medication_details))
    # Close consultation
    result = await db.execute(select(Consultation).filter(Consultation.id == request.consultation_id))
    consultation = result.scalars().first()
    if consultation: consultation.status = "Completed"
    await db.commit()
    return {"status": "Issued"}

@app.get("/doctor/earnings")
async def get_earnings(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(func.sum(Consultation.earnings)).filter(Consultation.status == "Completed"))
    total = result.scalar() or 0.0
    return {"total": total}

@app.post("/appointments/book")
async def book_appointment(request: AppointmentRequest, db: AsyncSession = Depends(get_db)):
    from models import Appointment
    new_app = Appointment(
        patient_name=request.patient_name,
        hospital_name=request.hospital_name,
        specialty=request.specialty,
        appointment_date=request.appointment_date,
        appointment_time=request.appointment_time,
        reason=request.reason
    )
    db.add(new_app)
    await db.commit()
    return {"status": "Protocol Confirmed", "booking_id": f"RX-{datetime.now().strftime('%Y%j%H%M')}"}

# --- OTHER ENDPOINTS ---

@app.get("/profile", response_model=ProfileSchema)
async def get_profile(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Profile).limit(1))
    return result.scalars().first() or ProfileSchema()

@app.post("/profile", response_model=ProfileSchema)
async def update_profile(request: ProfileSchema, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Profile).limit(1))
    profile = result.scalars().first()
    if profile:
        profile.age, profile.gender, profile.weight, profile.health_info = request.age, request.gender, request.weight, request.health_info
    else:
        profile = Profile(**request.dict())
        db.add(profile)
    await db.commit()
    await db.refresh(profile)
    return profile

@app.get("/history", response_model=List[HistorySchema])
async def get_history(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(MedicalHistory).order_by(MedicalHistory.timestamp.desc()))
    return result.scalars().all()

@app.get("/")
async def root(): return {"message": "Active"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
