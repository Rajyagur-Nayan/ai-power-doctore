# AI-Powered Rural Health Assistant

A comprehensive full-stack telemedicine platform designed for rural settings. It leverages cutting-edge AI (Groq + Llama 3, Gemini Flash) and reliable low-bandwidth WebRTC (LiveKit) to connect patients with medical resources and doctors seamlessly.

## 🚀 Features
- **Smart Hospital Locator**: Real-time Leaflet map integration to discover nearby clinical nodes and request OSRM routing.
- **Voice Health Assistant**: Speak naturally in Hindi/Hinglish. The app uses Groq Whisper for transcription, Llama 3 for intelligent triage, and Edge-TTS for audio response.
- **AI Medical Image Analysis**: Securely upload biological images (rashes, wounds) for preliminary analysis using Gemini 2.5 Flash vision models.
- **Telehealth Video Consultations**: Real-time, low-latency video calls powered by **LiveKit** WebRTC. Includes optimized low-bandwidth fallback mechanisms.
- **Healthcare Ops Dashboard**: Clinical AI agents simulating rule-based claim adjudication prior authorizations.
- **Doctor Portal**: Physicians can view incoming meeting requests in real-time, accept live consultations, and access patient medical logs.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (React 19)
- **Styling**: Tailwind CSS
- **Maps**: React Leaflet
- **WebRTC**: LiveKit Components React

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL (via SQLAlchemy + asyncpg)
- **AI Integration**: Groq (Llama-3-70b-versatile, Whisper-large-v3), Google Gemini (2.5-flash)
- **Voice Output**: Edge-TTS

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```ini
# PostgreSQL Database URL
DATABASE_URL="postgresql://user:password@host/dbname"

# AI Inference Keys
GROQ_API_KEY="gsk_..."
GEMINI_API_KEY="AIza..."

# LiveKit Server Keys (For backend token generation)
LIVEKIT_API_KEY="your_api_key"
LIVEKIT_API_SECRET="your_api_secret"
LIVEKIT_URL="wss://your-project.livekit.cloud"
```

### Frontend (`frontend/.env`)
```ini
# LiveKit Server URL (For frontend WebSocket connection)
NEXT_PUBLIC_LIVEKIT_URL="wss://your-project.livekit.cloud"
```

---

## 🏗️ Setup & Installation

### 1. Backend Setup
1. Open terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set your `.env` file credentials.
4. Run the FastAPI development server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Run the Next.js development server:
   ```bash
   npm run dev
   ```
4. Access the portal at `http://localhost:3000`.

---

## 📡 Core API Endpoints

- `POST /chat`: Text-based AI advisory chat.
- `POST /voice`: Audio input endpoint for Whisper transcription and TTS response.
- `POST /analyze-image`: Multimodal vision endpoint for analyzing physical symptoms.
- `GET /meeting/requests`: Fetch active patient video consultation requests.
- `POST /meeting/request`: Request a real-time WebRTC session.
- `POST /healthcare/process-case`: Agentic operations pipeline.
- `GET /history`: Fetch clinical interaction timeline logs.

## 📹 LiveKit Integration Notes
This application requires an active LiveKit server (either self-hosted or via LiveKit Cloud) to handle WebRTC routing securely. When a patient requests a meeting, the FastAPI backend uses the LiveKit Python client to generate secure access tokens for both the patient and the doctor. Ensure that your `NEXT_PUBLIC_LIVEKIT_URL` points exactly to the WebSocket address matching your Backend generation keys.
