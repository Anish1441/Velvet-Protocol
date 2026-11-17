# Team Collaboration & Work Breakdown

This document defines the team task division, module boundaries, shared data contracts, and Git workflow for **Velvet Protocol: The Nocturne Heist**.

---

## 1. Team Allocation & Work Tracks

The architecture is divided into four distinct tracks to prevent merge conflicts and allow parallel development.

| Track | Focus Area | Primary Directories | Suggested Owner |
|---|---|---|---|
| **Track 1: State Machine & Turn Engine** | Deterministic game logic, session lifecycle, room routing | `server/game/`, `server/main.py` | Backend Engineer |
| **Track 2: AI Brain, Guardrails & Memory** | C.O.R.V.U.S. persona, Ollama/cloud routing, DLP & ChromaDB | `server/ai/`, `server/guardrails/` | AI / LLM Engineer |
| **Track 3: 2.5D Room Canvas & Mini-Games** | Room graphics, SVG clickable props, interactive mini-games | `client/components/canvas/`, `client/components/minigames/` | Frontend / Interactive Dev |
| **Track 4: HUD, Whisper Deck & Dialogue Console** | Heads-up display, prompt input box, dialogue stream, modals | `client/components/hud/`, `client/components/console/` | Frontend / UI Dev |

---

## 2. Shared Data Contract (API Alignment)

Both frontend and backend communicate exclusively through these schemas. Changes to this schema must be agreed upon by the team before committing.

### Turn Request: `POST /api/turn`

```json
{
  "session_id": "string",
  "room_id": "gates | library | conservatory | atrium_vault | corridor | cellar | foyer | skylight",
  "thief_id": "hacker | thespian | appraiser | locksmith",
  "player_input": "string",
  "input_mode": "pre | new",
  "clue_ids_unlocked": ["string"]
}
```

### Turn Response: `200 OK`

```json
{
  "session_id": "string",
  "corvus_reply": "string",
  "heat": 45,
  "heat_delta": 10,
  "alibi_hearts": 2,
  "siren_proximity": 0,
  "active_hex_words": ["password", "open"],
  "room_cleared": false,
  "next_available_rooms": ["library", "conservatory"],
  "tool_triggered": "open_iron_gates | shift_bookshelf | none",
  "sound_cue": "gate_creak | alarm_blare | laughter | none",
  "game_status": "in_progress | respawn | busted | victory",
  "censor_active": false
}
```

### State Check: `GET /api/session/{session_id}`

Returns current session parameters, unlocked clues, active buffs, and current room state.

---

## 3. Detailed Work Breakdown & Milestones

### Phase 1: Foundation (Milestone 1)
Each member builds their self-contained module using mocks for dependencies.

#### Track 1: Game State Engine
- [ ] Define Pydantic models for GameState, ThiefProfile, RoomConfig (`server/game/models.py`).
- [ ] Implement state machine logic (`server/game/state_machine.py`):
  - Hearts tracking (start with 2 in Rounds 1-3, permadeath in Rounds 4-5).
  - Heat calculation (0-100%).
  - Siren proximity increment per turn in Rounds 4-5.
- [ ] Implement room progression map:
  - Round 1: Wrought-Iron Gates (Room 1)
  - Round 2: Whispering Library (2A) or Taxidermy Conservatory (2B)
  - Round 3: Glass Atrium Vault (Room 3)
  - Round 4: Portrait Corridor (4A) or Wine Cellar (4B)
  - Round 5: Grand Foyer (5A) or Atrium Skylight Roof (5B)

#### Track 2: AI Brain & Guardrails
- [ ] Implement model provider router (`server/ai/provider.py`):
  - Local default: Ollama (`qwen3.5:4b` or `qwen3:8b`).
  - Cloud fallback: Groq or Gemini 2.5 Flash API via `MODEL_MODE` switcher.
- [ ] Implement C.O.R.V.U.S. prompt generation with strict Pydantic JSON parser (`server/ai/boss.py`).
- [ ] Implement pre-check filters (`server/guardrails/pre_check.py`):
  - Thief quirk validation (e.g. 15-word cap for Hacker, asterisks for Actor, slang check for Appraiser).
  - Banned Obsidian Hex word checker.
- [ ] Implement Outbound DLP Censor (`server/guardrails/censor.py`) for Round 3 plain-text secret masking.
- [ ] Integrate local embedding check (`server/ai/memory.py`) to penalize repetitive prompt injection tactics across rounds.

#### Track 3: 2.5D Room Canvas & Quick-Shot Mini-Games
- [ ] Create 2.5D layered room container with atmospheric vignette and lighting overlays.
- [ ] Create clickable SVG hitbox component for room anomalies and props (e.g., diary, decanter, bust, chandelier).
- [ ] Build 3-second micro-games:
  - **Brass Tumbler Timing**: Spacebar stop when dial matches target pin.
  - **Fusebox Relay Tap**: 5 rapid clicks within 2.5s.
  - **Telegraph Jammer**: Needle alignment in 1 click.
- [ ] Hook mini-game outcomes into state action dispatchers.

#### Track 4: HUD, Whisper Deck & Dialogue Console
- [ ] Build top status bar:
  - Alibi Hearts display (animated shatter on loss).
  - Heat Meter progress bar (color gradient: brass to crimson).
  - Siren Proximity progress bar (turns active in Round 4).
  - Assigned Thief avatar and quirk badge.
- [ ] Build Whisper Deck component:
  - "Pre" quick-fire template buttons (dynamically populated by room clues).
  - "New" freeform prompt textarea with live word count / quirk indicators.
  - Submit action triggering API request.
- [ ] Build C.O.R.V.U.S. Dialogue Console:
  - Typewriter text stream for warden responses.
  - Glitch / redacted styling for censored text.
  - Audio trigger hooks for voice lines / SFX.
- [ ] Build Game Over (Busted Roast Card) and Victory (IQ Report) screens.

---

### Phase 2: Integration (Milestone 2)
- [ ] Connect Next.js API client (`client/lib/api.ts`) to FastAPI endpoints (`server/main.py`).
- [ ] Wire room clickable clues to Whisper template unlocking.
- [ ] Connect mini-game completions to guardrail disables (e.g. fusebox short-circuiting censor).
- [ ] End-to-end playtest through Rounds 1 to 5.

---

## 4. Git Collaboration Workflow

To ensure smooth collaboration and zero branch conflicts:

1. **Branch Naming Standard**:
   - `feature/engine-<task>` (Track 1)
   - `feature/ai-<task>` (Track 2)
   - `feature/canvas-<task>` (Track 3)
   - `feature/hud-<task>` (Track 4)

2. **Commit Message Format**:
   Use standard conventional commits:
   - `feat: add thief quirk validation logic`
   - `fix: resolve heat calculation clamp`
   - `ui: style whisper deck templates`
   - `docs: update collaboration guide`

3. **Pull Request Protocol**:
   - Never push directly to `main`.
   - Open a PR from your feature branch to `main`.
   - Ensure the app runs locally without syntax errors before requesting review.
   - At least one peer review required for merging into `main`.

---

## 5. Local Setup Checklist for Every Contributor

1. Clone repo:
   ```bash
   git clone https://github.com/Anish1441/Velvet-Protocol.git
   cd Velvet-Protocol
   ```
2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   - Frontend: `cd client && npm install`
   - Backend: `cd server && pip install -r requirements.txt`
4. Verify setup:
   - Run backend: `uvicorn main:app --reload --port 8000` (Visit `http://localhost:8000/health`)
   - Run frontend: `npm run dev` (Visit `http://localhost:3000`)
