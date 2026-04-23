from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from routes import router as auth_router
from finance_routes import router as finance_router
from investment_routes import router as investment_router
from contextlib import asynccontextmanager
import uvicorn

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB
    await init_db()
    yield
    # Cleanup (if needed)

app = FastAPI(title="Finance App API", lifespan=lifespan)

# Configure CORS for the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Relaxed for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router, tags=["auth"])
app.include_router(finance_router, tags=["finance"])
app.include_router(investment_router, tags=["investment"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Finance App API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
