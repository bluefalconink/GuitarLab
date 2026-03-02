# 🎸 GuitarLab

> A Falconverse plugin that helps musicians set up their guitars and get the best possible sound from the equipment on hand.

**GuitarLab** features two AI-powered expert agents:

| Agent | Domain | What It Does |
|-------|--------|-------------|
| **Master Luthier** | Mechanical setup | Walks you through the Sacred Order: Tune → Neck Relief → String Action → Nut Action → Intonation |
| **Tone & Electrical Guru** | Electronics & tone | Pickup wiring, component recommendations, troubleshooting hum/shorts |

---

## Quick Start

### Prerequisites
- **Python 3.11+**
- **Node.js 18+** & npm
- A **Google Gemini API key** ([get one here](https://aistudio.google.com/apikey))

### 1. Clone & configure
```bash
git clone https://github.com/bluefalconink/GuitarLab.git
cd GuitarLab
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### 2. Backend
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# macOS / Linux
# source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:3000** and start chatting!

---

## Project Structure

```
GuitarLab/
├── backend/
│   ├── agents/          # AI agent definitions (Luthier, Tone Guru)
│   ├── models/          # Pydantic request/response schemas
│   ├── rag/             # RAG knowledge store (keyword search)
│   ├── routes/          # FastAPI route handlers
│   ├── uploads/         # User-uploaded images
│   ├── utils/           # Shared utilities
│   ├── config.py        # App configuration
│   ├── main.py          # FastAPI entry point
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/  # React UI components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── styles/      # Tailwind + custom CSS
│   │   └── utils/       # API helpers
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── electronics_knowledge_base.json  # RAG source data (12 docs)
├── .env.example
├── .gitignore
└── README.md
```

---

## Features

- **Strict setup order enforcement** — the Luthier won't let you skip steps
- **Photo upload & analysis** — snap a photo of your bridge for hardware ID
- **Safety guardrails** — truss rod warnings, tube amp refusal, soldering safety
- **RAG-powered knowledge** — pickup color codes, schematics, troubleshooting
- **Mobile-first UI** — works perfectly on phone screens
- **Error boundaries** — graceful degradation, never a blank screen

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/chat` | Send a chat message |
| `POST` | `/api/upload` | Upload an image |
| `POST` | `/api/chat/advance-step` | Advance Luthier setup step |
| `GET` | `/api/chat/sessions/{id}` | Get session state |

---

## Tech Stack

- **Backend**: Python 3.13 · FastAPI 0.115 · Google Generative AI SDK 0.8.4
- **Frontend**: React 19 · Vite 6.4 · Tailwind CSS 3.4
- **AI**: Google Gemini API (gemini-2.5-flash) with keyword-based RAG

---

## License

MIT
