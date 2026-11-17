# ── Velvet Protocol — Makefile ────────────────────────

.PHONY: install-client install-server dev-client dev-server dev

install-client:
	cd client && npm install

install-server:
	cd server && pip install -r requirements.txt

dev-client:
	cd client && npm run dev

dev-server:
	cd server && uvicorn main:app --reload --port 8000

dev:
	@echo "Start both in separate terminals:"
	@echo "  make dev-client"
	@echo "  make dev-server"
