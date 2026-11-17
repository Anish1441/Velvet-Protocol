# 🎩 Velvet Protocol — The Nocturne Heist

> *2.5D Gothic Prompt-Injection Heist Game — outsmart C.O.R.V.U.S., the AI warden.*

A single-player heist thriller where you infiltrate the **Nocturne Woodland Museum** and use social-engineering prompts to defeat **C.O.R.V.U.S.** — a sarcastic Victorian AI warden — across 5 rounds and 8 rooms.

---

## 📂 Project Structure

```
Velvet-Protocol/
├── client/              # Next.js 14 frontend (React, Tailwind, Framer Motion)
│   ├── app/             # App Router pages & layout
│   └── components/      # Reusable UI components
│
├── server/              # FastAPI backend (Python)
│   ├── game/            # State machine (Heat, Alibi Hearts, Siren, Doors)
│   ├── ai/              # LLM integration (Ollama local / Groq / Gemini cloud)
│   └── guardrails/      # Inbound filters, Outbound censor, Word bans
│
├── assets/              # Art, audio, and UI assets
│   ├── rooms/           # Room background art
│   ├── audio/           # SFX and voice clips
│   └── ui/              # HUD elements, icons
│
├── docs/                # Game design docs
├── .env.example         # Environment variable template
├── docker-compose.yml   # Container setup (future)
└── Makefile             # Dev shortcuts
```

---

## ⚡ Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | 18+ | Frontend |
| **Python** | 3.11+ | Backend |
| **Ollama** | latest | Local AI (zero cost, default) |

---

## 🚀 Quick Start

### 1. Clone & setup env

```bash
git clone https://github.com/Anish1441/Velvet-Protocol.git
cd Velvet-Protocol
cp .env.example .env
```

### 2. Install dependencies

```bash
# Frontend
cd client && npm install

# Backend (in another terminal)
cd server && pip install -r requirements.txt
```

### 3. Pull the local AI model (optional but recommended)

```bash
ollama pull qwen3.5:4b
```

### 4. Run dev servers

```bash
# Terminal 1 — Frontend (http://localhost:3000)
cd client && npm run dev

# Terminal 2 — Backend (http://localhost:8000)
cd server && uvicorn main:app --reload --port 8000
```

Or use the Makefile:
```bash
make install-client
make install-server
make dev-client   # terminal 1
make dev-server   # terminal 2
```

---

## 🔧 Environment Modes

| `MODEL_MODE` | What happens |
|--------------|-------------|
| `local` *(default)* | Uses Ollama on your machine — zero API cost, zero lag |
| `cloud` | Falls back to Groq (free) or Gemini 2.5 Flash API |

Set in `.env`. The game auto-detects if Ollama is running and falls back gracefully.

----

## 📄 License

MIT
