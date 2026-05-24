from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import upload, analyze, chat, eda

app = FastAPI(title="AI Data Analyst")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router)
app.include_router(analyze.router)
app.include_router(chat.router)
app.include_router(eda.router)
