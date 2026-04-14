"use client";

import { useState, useEffect } from "react";
// Optional UI button, fallback to standard button if not imported
import MeetingRoom from "./MeetingRoom";
import { Loader2 } from "lucide-react";

export default function PatientMeetingRequest({
  patientId,
  doctorId,
}: {
  patientId: string;
  doctorId: string;
}) {
  const [requestId, setRequestId] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "idle" | "pending" | "accepted" | "declined"
  >("idle");
  const [token, setToken] = useState<string | null>(null);
  const [roomName, setRoomName] = useState<string | null>(null);

  const requestMeeting = async () => {
    try {
      setStatus("pending");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/meeting/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient_id: patientId, doctor_id: doctorId }),
      });
      const data = await res.json();
      setRequestId(data.request_id);
    } catch (err) {
      console.error(err);
      setStatus("idle");
    }
  };

  useEffect(() => {
    if (status !== "pending" || !requestId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/meeting/status/${requestId}`,
        );
        if (!res.ok) return;

        const data = await res.json();
        if (data.status === "accepted") {
          setToken(data.patient_token);
          setRoomName(data.room_name);
          setStatus("accepted");
          clearInterval(interval);
        } else if (data.status === "declined") {
          setStatus("declined");
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [status, requestId]);

  if (status === "accepted" && token && roomName) {
    return (
      <div className="p-4  space-y-4 border rounded-xl bg-white shadow-sm">
        <h2 className="text-xl font-bold">Live Consultation</h2>
        <MeetingRoom
          token={token}
          roomName={roomName}
          onLeave={() => {
            setStatus("idle");
            setToken(null);
            setRequestId(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-xl shadow-sm bg-white max-w-sm mx-auto text-center space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">
        Video Consultation
      </h3>

      {status === "idle" && (
        <>
          <p className="text-sm text-gray-500">
            Connect with Doctor live for an urgent video visit.
          </p>
          <button
            onClick={requestMeeting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition"
          >
            Request Meeting
          </button>
        </>
      )}

      {status === "pending" && (
        <div className="flex flex-col items-center p-4 bg-blue-50 text-blue-800 rounded-lg">
          <Loader2 className="w-8 h-8 animate-spin mb-2 text-blue-500" />
          <p className="font-medium">Waiting for doctor...</p>
          <p className="text-sm text-blue-600 mt-1">
            Please do not close this window.
          </p>
        </div>
      )}

      {status === "declined" && (
        <div className="p-4 bg-red-50 text-red-800 rounded-lg">
          <p className="font-medium">The doctor declined your request.</p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-3 w-full bg-white text-gray-800 font-medium py-2 px-4 rounded-md transition border hover:bg-gray-50"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
