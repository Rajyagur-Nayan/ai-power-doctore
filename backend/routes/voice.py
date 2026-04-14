import os
import base64
import asyncio
import tempfile
from fastapi import APIRouter, UploadFile, File, HTTPException
from groq import Groq
import edge_tts
from pydantic import BaseModel

from dotenv import load_dotenv

router = APIRouter()

# Load environment variables explicitly for this route
load_dotenv()

# Initialize Groq client
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

VOICE_SYSTEM_PROMPT = """You are a helpful rural medical assistant. 
You MUST provide all your responses in Hindi text (Devanagari script) and speak in simple, clear Hindi language.
Provide short, safe, and clear advice. Maximum 2-3 sentences. 
If it's an emergency, explicitly tell them to go to a hospital immediately in Hindi."""

class VoiceResponse(BaseModel):
    text: str
    audio: str

class TTSRequest(BaseModel):
    text: str


async def generate_voice(text: str) -> str:
    """Generates base64 encoded MP3 audio using edge-tts."""
    communicate = edge_tts.Communicate(text, "hi-IN-SwaraNeural")
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp_file:
        tmp_path = tmp_file.name

    try:
        await communicate.save(tmp_path)
        with open(tmp_path, "rb") as f:
            audio_data = f.read()
        return base64.b64encode(audio_data).decode("utf-8")
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

@router.post("/voice/tts")
async def generate_tts(req: TTSRequest):
    try:
        audio_base64 = await generate_voice(req.text)
        return {"audio": audio_base64}
    except Exception as e:
        print(f"TTS Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/voice", response_model=VoiceResponse)
async def voice_assistant(file: UploadFile = File(...)):
    if not client:
        raise HTTPException(status_code=500, detail="Groq client not initialized")

    try:
        # 1. Read audio directly into memory and wrap in BytesIO
        audio_bytes = await file.read()
        
        if len(audio_bytes) < 1000:
            raise HTTPException(
                status_code=400, 
                detail="रिकॉर्डिंग बहुत छोटी है! हमने कोई ऑडियो नहीं पकड़ा। कृपया माइक को पकड़ें और कम से कम एक सेकंड के लिए स्पष्ट रूप से बोलें।"
            )

        import io
        audio_stream = io.BytesIO(audio_bytes)
        audio_stream.name = "audio.webm"

        # 2. Transcribe using Groq Whisper
        transcription = client.audio.transcriptions.create(
            file=audio_stream,
            model="whisper-large-v3",
            response_format="text"
        )

        if not transcription:
            raise HTTPException(status_code=400, detail="Transcription failed")

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": VOICE_SYSTEM_PROMPT},
                {"role": "user", "content": transcription}
            ],
            temperature=0.5,
            max_tokens=150
        )

        ai_text = completion.choices[0].message.content

        # 4. Generate Voice (TTS)
        audio_base64 = await generate_voice(ai_text)

        return VoiceResponse(text=ai_text, audio=audio_base64)

    except Exception as e:
        print(f"Voice Assistant Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
