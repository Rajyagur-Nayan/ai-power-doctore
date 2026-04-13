import os
import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from livekit.api import AccessToken, VideoGrants

router = APIRouter()

# In-memory storage for simple database
# Structure: { request_id: { "id": str, "patient_id": str, "doctor_id": str, "status": "pending"|"accepted"|"declined", "created_at": str, "patient_token": str | None, "room_name": str | None } }
meeting_requests: Dict[str, dict] = {}

class MeetingRequest(BaseModel):
    patient_id: str
    doctor_id: str

def create_token(room_name: str, identity: str, name: str) -> str:
    # livekit-api reads LIVEKIT_API_KEY and LIVEKIT_API_SECRET from environment by default
    api_key = os.getenv("LIVEKIT_API_KEY")
    api_secret = os.getenv("LIVEKIT_API_SECRET")
    
    if not api_key or not api_secret:
        raise HTTPException(status_code=500, detail="LiveKit credentials not configured in backend!")
        
    grant = VideoGrants(room=room_name, room_join=True)
    access_token = AccessToken(api_key, api_secret)
    access_token.with_identity(identity)
    access_token.with_name(name)
    access_token.with_grants(grant)
    
    access_token.with_ttl(timedelta(hours=2))
    
    return access_token.to_jwt()

@router.post("/request")
async def request_meeting(req: MeetingRequest):
    request_id = str(uuid.uuid4())
    meeting_requests[request_id] = {
        "id": request_id,
        "patient_id": req.patient_id,
        "doctor_id": req.doctor_id,
        "status": "pending",
        "created_at": datetime.utcnow().isoformat(),
        "patient_token": None,
        "room_name": None
    }
    return {"request_id": request_id, "status": "pending"}

@router.get("/requests")
async def get_requests():
    # Return all pending requests
    pending = [req for req in meeting_requests.values() if req["status"] == "pending"]
    # Sort by created_at desc
    pending.sort(key=lambda x: x["created_at"], reverse=True)
    return {"requests": pending}

@router.get("/status/{request_id}")
async def get_status(request_id: str):
    if request_id not in meeting_requests:
        raise HTTPException(status_code=404, detail="Request not found")
        
    req = meeting_requests[request_id]
    
    return {
        "status": req["status"],
        "patient_token": req["patient_token"],
        "room_name": req["room_name"]
    }

@router.post("/accept/{request_id}")
async def accept_meeting(request_id: str):
    if request_id not in meeting_requests:
        raise HTTPException(status_code=404, detail="Request not found")
        
    req = meeting_requests[request_id]
    if req["status"] != "pending":
        raise HTTPException(status_code=400, detail="Request already processed")
        
    room_name = f"room_{request_id}"
    
    # Generate token for Doctor
    doctor_token = create_token(room_name, f"doc_{req['doctor_id']}", f"Doctor")
    
    # Generate token for Patient
    patient_token = create_token(room_name, f"pat_{req['patient_id']}", f"Patient")
    
    meeting_requests[request_id]["status"] = "accepted"
    meeting_requests[request_id]["patient_token"] = patient_token
    meeting_requests[request_id]["room_name"] = room_name
    
    return {
        "status": "accepted",
        "doctor_token": doctor_token,
        "room_name": room_name
    }

@router.post("/decline/{request_id}")
async def decline_meeting(request_id: str):
    if request_id not in meeting_requests:
        raise HTTPException(status_code=404, detail="Request not found")
        
    meeting_requests[request_id]["status"] = "declined"
    
    return {"status": "declined"}
