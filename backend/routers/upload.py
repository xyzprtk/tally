from fastapi import APIRouter, UploadFile, File, HTTPException

from services import dataset
from models.schemas import UploadResponse

router = APIRouter()


@router.post("/api/upload", response_model=UploadResponse)
async def upload_dataset(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    filename = file.filename.lower()
    if not (filename.endswith(".csv") or filename.endswith(".json")):
        raise HTTPException(status_code=415, detail="Only CSV and JSON files are supported")

    return dataset.load_dataset(file)
