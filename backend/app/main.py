from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import api_router
from app.db.session import Base, engine

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PrimeTrade AI - Trade Journal API",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "PrimeTrade AI API is running"}
