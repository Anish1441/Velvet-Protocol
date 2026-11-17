# Velvet Protocol — The Nocturne Heist

> 2.5D Gothic Social-Engineering & Prompt-Injection Heist Thriller

Velvet Protocol is a single-player heist game where the player infiltrates the Nocturne Woodland Museum to extract the Lazarus Core. The primary antagonist is C.O.R.V.U.S. (Curatorial Omniscient Response & Vault Utility System), a Victorian AI warden that adapts to player strategies across a 5-round, 8-room non-linear museum layout.

---

## Architecture Overview

```
Velvet-Protocol/
├── client/              # Next.js 14 frontend (App Router, Tailwind CSS, Framer Motion)
│   ├── app/             # Application routes and main viewport
│   ├── components/      # UI components (HUD, Whisper Deck, 2.5D Canvas)
│   └── lib/             # API client and client state helpers
│
├── server/              # FastAPI backend
│   ├── game/            # Deterministic state machine (Hearts, Heat, Siren, Route)
│   ├── ai/              # AI Boss pipeline (Ollama local / Groq / Gemini cloud)
│   └── guardrails/      # Inbound keyword filters, DLP censor, Obsidian Hex bans
│
├── assets/              # Static game assets
│   ├── rooms/           # 2.5D layered room background art
│   ├── audio/           # Sound effects and voice lines
│   └── ui/              # HUD textures and iconography
│
├── docs/                # Design specifications and documentation
├── COLLABORATION.md     # Team task distribution, API contract, and Git workflow
├── .env.example         # Environment configuration template
├── docker-compose.yml   # Multi-container orchestration definition
└── Makefile             # Local development automation commands
```

---

## Prerequisites

| Requirement | Minimum Version | Purpose |
|---|---|---|
| Node.js | 18.0.0+ | Frontend application runtime |
| Python | 3.11+ | Backend game engine and AI orchestration |
| Ollama | Latest | Optional local model runtime for zero-latency execution |

---

## Installation & Setup

### 1. Repository Setup

```bash
git clone https://github.com/Anish1441/Velvet-Protocol.git
cd Velvet-Protocol
cp .env.example .env
```

### 2. Client Installation

```bash
cd client
npm install
```

### 3. Server Installation

```bash
cd ../server
pip install -r requirements.txt
```

### 4. Local Model Configuration (Optional)

If running in local mode with Ollama:

```bash
ollama pull qwen3.5:4b
```

---

## Development Execution

Run frontend and backend services in separate terminal sessions:

```bash
# Terminal 1 — Client (http://localhost:3000)
cd client
npm run dev

# Terminal 2 — Server (http://localhost:8000)
cd server
uvicorn main:app --reload --port 8000
```

Alternatively, use the Makefile helpers:

```bash
make install-client
make install-server
make dev-client
make dev-server
```

---

## Environment Configuration

Configure the execution mode in `.env`:

| Variable | Options | Description |
|---|---|---|
| `MODEL_MODE` | `local` \| `cloud` | Determines model provider routing. |
| `OLLAMA_HOST` | URL | Endpoint for local Ollama service (default: `http://localhost:11434`). |
| `OLLAMA_MODEL` | string | Target model tag (e.g., `qwen3.5:4b`, `qwen3:8b`). |
| `GROQ_API_KEY` | string | API key for cloud fallback using Groq free tier. |
| `GEMINI_API_KEY` | string | API key for cloud fallback using Google Gemini API. |
| `SARVAM_API_KEY` | string | API key for text-to-speech and voice intercom services. |

---

## Team & Development Guidelines

For task assignments, milestone planning, JSON interface schemas, and Git branching rules, refer to [COLLABORATION.md](COLLABORATION.md).

### Team Members

- Rohan Deogaonkar (`rohandeogaonkar.9@gmail.com`)
- Manthan Keni (`manthankeni9@gmail.com`)
- Priyanshu Hazra (`priyanshu.hazra2007@gmail.com`)
- Anish Apparaju

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
