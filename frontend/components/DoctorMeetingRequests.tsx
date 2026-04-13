"use client";

import { useState, useEffect } from "react";
import MeetingRoom from "./MeetingRoom";

type RequestType = {
  id: string;
  patient_id: string;
  doctor_id: string;
  status: string;
  created_at: string;
};

export default function DoctorMeetingRequests({ doctorId }: { doctorId: string }) {
  const [requests, setRequests] = useState<RequestType[]>([]);
  const [activeSession, setActiveSession] = useState<{ token: string; roomName: string } | null>(null);

  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:8000/meeting/requests");
      if (!res.ok) return;
      const data = await res.json();
      
      // Filter for this doctor (if needed, currently we fetch all for demo simplicity)
      const thisDoctorRequests = data.requests.filter((r: RequestType) => r.doctor_id === doctorId);
      setRequests(thisDoctorRequests);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    }
  };

  useEffect(() => {
    // Poll for mostly real-time updates without websockets for simplicity
    fetchRequests();
    const interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);
  }, [doctorId]);

  const acceptRequest = async (requestId: string) => {
    try {
      const res = await fetch(`http://localhost:8000/meeting/accept/${requestId}`, {
        method: "POST"
      });
      if (res.ok) {
        const data = await res.json();
        setActiveSession({ token: data.doctor_token, roomName: data.room_name });
        // remove from local list
        setRequests(prev => prev.filter(r => r.id !== requestId));
      }
    } catch (err) {
      console.error("Failed to accept", err);
    }
  };

  const declineRequest = async (requestId: string) => {
    try {
      await fetch(`http://localhost:8000/meeting/decline/${requestId}`, {
        method: "POST"
      });
      setRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (err) {
      console.error("Failed to decline", err);
    }
  };

  if (activeSession) {
    return (
      <div className="p-4 bg-white border rounded-xl shadow-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Active Live Consultation</h2>
          <span className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium animate-pulse">
            Patient Connected
          </span>
        </div>
        <MeetingRoom 
          token={activeSession.token} 
          roomName={activeSession.roomName} 
          onLeave={() => setActiveSession(null)} 
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            {requests.length > 0 && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>}
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          Live Requests ({requests.length})
        </h3>
      </div>
      
      {requests.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <p>No active meeting requests right now.</p>
        </div>
      ) : (
        <div className="divide-y">
          {requests.map(req => (
            <div key={req.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
              <div>
                <p className="font-medium text-gray-800">Patient: {req.patient_id}</p>
                <p className="text-xs text-gray-500 mt-1">Requested at {new Date(req.created_at).toLocaleTimeString()}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => acceptRequest(req.id)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition"
                >
                  Accept & Join
                </button>
                <button 
                  onClick={() => declineRequest(req.id)}
                  className="px-4 py-2 bg-white border hover:bg-red-50 text-red-600 font-medium rounded-md transition"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
