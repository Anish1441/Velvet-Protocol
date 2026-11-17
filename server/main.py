"""Velvet Protocol — FastAPI backend."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Velvet Protocol — Server",
    description="Backend for the Nocturne Heist game engine.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "alive", "warden": "C.O.R.V.U.S."}
