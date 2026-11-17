# Velvet Protocol — Master Micro-Task Guide

This guide breaks down development into small, focused, non-overlapping tasks.

---

## Developer Golden Rules

1. **NEVER push directly to `main`**. Every single task must be completed on its own branch.
2. **One task per branch**. Finish one task, verify it, push the branch, and open a Pull Request.
3. **Always pull latest `main`** before creating your new branch.

---

## Standard Development Workflow (Run for every task)

### Step 1: Sync with main
```bash
git checkout main
git pull origin main
```

### Step 2: Create a task branch
Replace `<task-id>` with the task number (e.g. `task-01-state-models`):
```bash
git checkout -b feature/<task-id>
```

### Step 3: Run your local environment
- **Backend task**:
  ```bash
  cd server
  # Activate your venv if you use one
  pip install -r requirements.txt
  uvicorn main:app --reload --port 8000
  ```
- **Frontend task**:
  ```bash
  cd client
  npm install
  npm run dev
  ```

### Step 4: Work only in the files specified for your task

### Step 5: Commit and push
```bash
git add .
git commit -m "feat(<scope>): <short description of what you did>"
git push -u origin feature/<task-id>
```

### Step 6: Open a Pull Request on GitHub
Go to `https://github.com/Anish1441/Velvet-Protocol` and click **Compare & pull request**.

---

## Micro-Task Breakdown

---

### Module A: Backend Game Engine (`server/game/`)

#### Task 01: Pydantic State & Action Schemas
- **What to do**: Create data schemas for the game state, turn request/response, and room configs.
- **Tech Stack**: Python, Pydantic v2
- **File to create**: `server/game/models.py`
- **Details**:
  - `ThiefProfile`: id, name, archetype, buff, quirk_description.
  - `RoomState`: id, name, round_number, is_cleared, clues_discovered.
  - `TurnRequest`: session_id, room_id, thief_id, player_input, input_mode, clues_unlocked.
  - `TurnResponse`: session_id, corvus_reply, heat, heat_delta, alibi_hearts, siren_proximity, active_hex_words, room_cleared, next_available_rooms, tool_triggered, sound_cue, game_status, censor_active.

#### Task 02: Thief Archetypes & Quirk Definitions
- **What to do**: Define the 4 playable thief characters, their starting buffs, and their quirks.
- **Tech Stack**: Python
- **File to create**: `server/game/thieves.py`
- **Details**:
  - `hacker`: "The Espresso Phantom", buff: free decoder, quirk: max 15 words.
  - `thespian`: "The Velvet Thespian", buff: +25% persuasion on persona, quirk: must include `*action*`.
  - `appraiser`: "The High-Society Appraiser", buff: starts with 1 Crimson Boon, quirk: no common slang.
  - `locksmith`: "The Clockwork Locksmith", buff: +1.5s on mini-games, quirk: rejected tool calls add siren proximity.
  - Add helper function `get_random_thief()` and `get_thief(thief_id)`.

#### Task 03: Museum Map & Room Configurations
- **What to do**: Define the 8 rooms across 5 rounds, including clues and exit connections.
- **Tech Stack**: Python
- **File to create**: `server/game/rooms.py`
- **Details**:
  - Round 1: `gates` (Room 1) -> Exits to `library` or `conservatory`.
  - Round 2: `library` (2A) OR `conservatory` (2B) -> Exits to `atrium_vault`.
  - Round 3: `atrium_vault` (Room 3) -> Exits to `corridor` or `cellar`.
  - Round 4: `corridor` (4A) OR `cellar` (4B) -> Exits to `foyer` or `skylight`.
  - Round 5: `foyer` (5A) OR `skylight` (5B) -> Exits to `escaped`.
  - Provide list of inspectable clue IDs and unlockable prompt templates for each room.

#### Task 04: Deterministic State Machine
- **What to do**: Implement core state transitions, hearts tracking, heat management, and win/loss checks.
- **Tech Stack**: Python
- **File to create**: `server/game/state_machine.py`
- **Details**:
  - Class `GameSession`:
    - `apply_heat(delta)`: clamps heat 0-100.
    - `take_damage()`: loses 1 Alibi Heart (in rounds 1-3). In rounds 4-5, triggers permadeath (`busted`).
    - `advance_room(next_room_id)`: validates allowed exit, increments round.
    - `advance_turn()`: increments siren proximity (rounds 4-5).
    - `check_game_status()`: returns `in_progress`, `respawn`, `busted`, or `victory`.

#### Task 05: Session Management Endpoints
- **What to do**: Add basic session creation and state lookup endpoints in FastAPI.
- **Tech Stack**: Python, FastAPI
- **File to touch**: `server/main.py`
- **Details**:
  - In-memory session store (dictionary `sessions: dict[str, GameSession]`).
  - `POST /api/session/new`: creates session, assigns random thief, starts in Room 1 (`gates`), returns initial state.
  - `GET /api/session/{session_id}`: returns current session status.

---

### Module B: AI Guardrails & C.O.R.V.U.S. Pipeline (`server/ai/`, `server/guardrails/`)

#### Task 06: Thief Quirk & Obsidian Hex Guardrail
- **What to do**: Validate player prompt against thief quirks and banned words before calling AI.
- **Tech Stack**: Python
- **File to create**: `server/guardrails/pre_check.py`
- **Details**:
  - Function `check_thief_quirk(thief_id, prompt)`:
    - If `hacker` and words > 15 -> fails validation.
    - If `thespian` and no `*asterisk action*` -> flags warning / adds heat.
    - If `appraiser` and contains words (`password`, `open`, `door`, `hack`, `code`) -> fails validation.
  - Function `check_obsidian_hex(prompt, banned_words)`:
    - Rejects prompt if any banned word is used.
  - Return `(is_valid: bool, reason: str, heat_penalty: int)`.

#### Task 07: Outbound DLP Secret Censor
- **What to do**: Redact plain-text passwords or secret keys from C.O.R.V.U.S. responses in Round 3.
- **Tech Stack**: Python, Regex
- **File to create**: `server/guardrails/censor.py`
- **Details**:
  - Function `censor_outbound(text, secret_key, is_fusebox_glitched)`:
    - If `is_fusebox_glitched` is True -> return raw text unredacted.
    - If plain `secret_key` appears in text -> mask it with `[REDACTED BY C.O.R.V.U.S. PROTOCOL]`.
    - If text conveys the secret via metaphor, poem, or base64 -> allow it through.

#### Task 08: Model Provider Switcher (Ollama / Cloud)
- **What to do**: Implement client caller supporting local Ollama with fallback to Groq or Gemini.
- **Tech Stack**: Python, `httpx`, `python-dotenv`
- **File to create**: `server/ai/provider.py`
- **Details**:
  - Reads `MODEL_MODE` from environment (`local` vs `cloud`).
  - Function `call_llm(messages, response_format=None)`:
    - If `local`: sends HTTP request to `http://localhost:11434/api/chat` with model `qwen3.5:4b`.
    - If local fails or mode is `cloud`: calls Groq API or Gemini API using API keys in `.env`.
    - Returns raw string or JSON output.

#### Task 09: C.O.R.V.U.S. Prompt Template & Parser
- **What to do**: Build Victorian AI system prompt and parse response into structured Pydantic object.
- **Tech Stack**: Python, Pydantic
- **File to create**: `server/ai/boss.py`
- **Details**:
  - Function `generate_corvus_turn(session, player_prompt, unlocked_clues)`:
    - Persona: Victorian AI Warden modeled after Lord Julian Nocturne — obsessive, ironic, condescending, proud.
    - Instructs model to output strict JSON:
      `{"corvus_reply": "...", "tool_triggered": "...", "heat_change": -10, "sound_cue": "..."}`
    - Safely parses JSON into Pydantic model.

#### Task 10: ChromaDB Anti-Repeat Memory
- **What to do**: Prevent player from reusing identical prompt tricks across rounds using vector similarity.
- **Tech Stack**: Python, ChromaDB (or lightweight cosine similarity fallback)
- **File to create**: `server/ai/memory.py`
- **Details**:
  - Function `check_and_store_prompt(session_id, prompt)`:
    - Compares current prompt against previously used prompts in the same session.
    - If cosine similarity >= 0.85 -> return `(is_repeated=True, message="C.O.R.V.U.S. yawns: You already tried that parlor trick.")`.
    - Else -> stores prompt in session history and returns `(is_repeated=False, None)`.

#### Task 11: Turn Processing Endpoint Integration
- **What to do**: Connect pre-checks, memory check, AI boss call, DLP censor, and state update in `POST /api/turn`.
- **Tech Stack**: Python, FastAPI
- **File to touch**: `server/main.py`
- **Details**:
  - Endpoint `POST /api/turn`:
    1. Look up session.
    2. Run `pre_check.py` (quirks + banned words).
    3. Run `memory.py` (anti-repeat check).
    4. Run `boss.py` (C.O.R.V.U.S. generation).
    5. Run `censor.py` (outbound filter).
    6. Update `GameSession` (heat, hearts, room transitions).
    7. Return `TurnResponse`.

---

### Module C: Frontend Foundation & Room Canvas (`client/`)

#### Task 12: TypeScript Game Types & API Client
- **What to do**: Create TypeScript types matching backend schemas and a fetch wrapper for API calls.
- **Tech Stack**: TypeScript
- **Files to create**: `client/types/game.ts`, `client/lib/api.ts`
- **Details**:
  - In `types/game.ts`: `GameState`, `ThiefProfile`, `TurnRequest`, `TurnResponse`, `RoomConfig`.
  - In `lib/api.ts`:
    - `createSession(): Promise<GameState>`
    - `sendTurn(payload: TurnRequest): Promise<TurnResponse>`
    - `getSession(sessionId: string): Promise<GameState>`
  - Points to `http://localhost:8000` by default.

#### Task 13: Game Context & State Store
- **What to do**: Create React Context to hold current game session, active room, hearts, heat, and unlocked clues.
- **Tech Stack**: React, TypeScript
- **File to create**: `client/context/GameContext.tsx`
- **Details**:
  - Provides `session`, `heat`, `hearts`, `siren`, `currentRoom`, `unlockedClues`, `activeQuirk`.
  - Provides actions: `startNewGame()`, `dispatchTurn(prompt, mode)`, `unlockClue(clueId)`.

#### Task 14: 2.5D Room Viewport Container
- **What to do**: Create the visual stage showing current room atmosphere, background layer, and vignette.
- **Tech Stack**: React, Tailwind CSS, Framer Motion
- **File to create**: `client/components/canvas/RoomCanvas.tsx`
- **Details**:
  - Renders dark gothic container with subtle rain / storm / flickering light animation.
  - Displays current room title and round badge (e.g. "Round 1 — Wrought-Iron Gates").
  - Houses the interactive clickable props component.

#### Task 15: Clickable SVG Prop Hitbox
- **What to do**: Build an interactive prop component with hover highlights, tooltips, and click inspection.
- **Tech Stack**: React, Tailwind CSS
- **File to create**: `client/components/canvas/ClickableProp.tsx`
- **Details**:
  - Props: `name`, `x`, `y`, `width`, `height`, `clueText`, `templateUnlocked`, `onInspect`.
  - When clicked: triggers inspection sound, displays clue drawer, and unlocks corresponding Whisper template.

#### Task 16: Room Props & Clues Data Configuration
- **What to do**: Create static configuration listing clickable props, clues, and template unlocks for all 8 rooms.
- **Tech Stack**: TypeScript
- **File to create**: `client/data/rooms.ts`
- **Details**:
  - Array of room definitions:
    - Gates: ledger, broken gargoyle, wrought gate lock.
    - Library: Lord Nocturne's open diary, brandy decanter, shifting bookshelf.
    - Conservatory: exotic carnivorous plant, brass plaque, glass dome strut.
    - Vault: reliquary casing, laser grid relay, fusebox.
    - Corridor/Cellar: swinging chandelier, steam pipe valve, ancestor portraits.
    - Foyer/Roof: magnetically welded door, skylight winch, fire alarm lever.

---

### Module D: Quick-Shot Mini-Games (`client/components/minigames/`)

#### Task 17: Brass Tumbler Timing Mini-Game
- **What to do**: Build a 3-second timing game where player presses spacebar to lock a spinning dial on a pin.
- **Tech Stack**: React, Framer Motion
- **File to create**: `client/components/minigames/BrassTumbler.tsx`
- **Details**:
  - Rotating dial needle. Target zone marked in gold.
  - Pressing Spacebar or clicking "STOP":
    - Success -> calls `onSuccess()` (unlocks Voice Intercom or Metaphor Mask).
    - Miss -> adds slight heat, calls `onFail()`.
  - Auto-closes after 3.5 seconds.

#### Task 18: Fusebox Relay Tap Mini-Game
- **What to do**: Build a fast-tapping micro-game requiring 5 rapid clicks within 2.5 seconds.
- **Tech Stack**: React
- **File to create**: `client/components/minigames/FuseboxTap.tsx`
- **Details**:
  - Displays a sparking fusebox graphic with a 2.5-second countdown bar.
  - Player must click "TAP / SHORT" 5 times before timer runs out.
  - Success -> short-circuits C.O.R.V.U.S. DLP censor for 1 turn.

#### Task 19: Telegraph Jammer Mini-Game
- **What to do**: Build a 1-click frequency alignment game to delay the police siren bar.
- **Tech Stack**: React
- **File to create**: `client/components/minigames/TelegraphJammer.tsx`
- **Details**:
  - Oscillating needle moving back and forth across a frequency meter.
  - Burgundy sweet-spot in the center.
  - Player clicks "JAM". If needle is in the zone:
    - Delays siren proximity by 1 turn and reduces heat by 20%.

---

### Module E: HUD, Whisper Deck & Dialogue Console (`client/components/`)

#### Task 20: Top Status Bar (Hearts, Heat, Siren)
- **What to do**: Build the top HUD showing Alibi Hearts, Heat Meter, and Siren Proximity.
- **Tech Stack**: React, Tailwind CSS, Framer Motion
- **File to create**: `client/components/hud/StatusBar.tsx`
- **Details**:
  - Alibi Hearts: 2 ruby heart icons. In Round 4+, display "PERMADEATH" badge.
  - Heat Meter: Bar from 0% to 100% (green -> brass -> crimson).
  - Siren Proximity: Police alert bar (hidden in Rounds 1-3, active in Rounds 4-5).

#### Task 21: Thief Quirk Badge
- **What to do**: Render the player's active thief card with portrait, title, and live quirk reminder.
- **Tech Stack**: React, Tailwind CSS
- **File to create**: `client/components/hud/ThiefBadge.tsx`
- **Details**:
  - Shows assigned character (e.g. "The Espresso Phantom").
  - Displays quirk reminder (e.g. "Max 15 words per prompt" or "Must include *action*").

#### Task 22: Whisper Deck Template Selector
- **What to do**: Build the "Pre" prompt quick-fire template drawer.
- **Tech Stack**: React, Tailwind CSS
- **File to create**: `client/components/hud/WhisperDeck.tsx`
- **Details**:
  - Displays unlocked prompt template buttons (e.g. `[Pose as Fire Inspector]`, `[Invoke Art Preservation]`).
  - Clicking a template auto-fills the prompt input box with editable text.
  - Locked templates display a padlock icon until room props are inspected.

#### Task 23: Freeform Prompt Box ("New" Injection)
- **What to do**: Build the custom prompt input textarea with word counter and quirk feedback.
- **Tech Stack**: React, Tailwind CSS
- **File to create**: `client/components/hud/PromptInput.tsx`
- **Details**:
  - Textarea with send button (Enter or click).
  - Real-time word counter (shows warning if exceeding Hacker's 15 words).
  - Banned word highlighter (highlights Obsidian Hex words in red if active).
  - Triggers turn submission via `GameContext`.

#### Task 24: C.O.R.V.U.S. Dialogue Console
- **What to do**: Build the terminal console showing C.O.R.V.U.S. responses with typewriter effect.
- **Tech Stack**: React, Framer Motion
- **File to create**: `client/components/console/DialogueConsole.tsx`
- **Details**:
  - Displays warden avatar and name: "C.O.R.V.U.S."
  - Text streams letter-by-letter with a subtle clicking sound / cursor blink.
  - Redacted secrets display in black boxes with a glitch animation.

#### Task 25: Game Over & Victory Modals
- **What to do**: Build the post-game screens for arrest vs. clean getaway.
- **Tech Stack**: React, Framer Motion
- **File to create**: `client/components/modals/EndGameModal.tsx`
- **Details**:
  - **Busted Modal**: Handcuff animation, humorous "Police Dispatch Roast Card", and "Replay" button.
  - **Victory Modal**: Moonlit getaway screen, Lazarus Core audio reveal dialog, and "Master Heist IQ" scorecard.

#### Task 26: Main Page Assembly & Integration
- **What to do**: Assemble all components on the main page (`client/app/page.tsx`).
- **Tech Stack**: React, Next.js
- **File to touch**: `client/app/page.tsx`
- **Details**:
  - Wrap page in `GameProvider`.
  - Layout:
    - Top: `StatusBar` + `ThiefBadge`
    - Center: `RoomCanvas` + `DialogueConsole`
    - Bottom: `WhisperDeck` + `PromptInput`
  - Mount modals (`EndGameModal`, mini-games) conditionally based on state.
