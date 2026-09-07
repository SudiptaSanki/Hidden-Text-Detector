from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from analyzers.text_analyzer import analyze_text
from analyzers.image_analyzer import analyze_image
from analyzers.pdf_analyzer import analyze_pdf
from analyzers.audio_analyzer import analyze_audio

app = FastAPI(title="Hidden Text Detector API")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextRequest(BaseModel):
    text: str

@app.post("/analyze/text")
async def analyze_text_endpoint(request: TextRequest):
    if not request.text:
        raise HTTPException(status_code=400, detail="No text provided")
    results = analyze_text(request.text)
    return results

@app.post("/analyze/image")
async def analyze_image_endpoint(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    contents = await file.read()
    results = analyze_image(contents)
    return results

@app.post("/analyze/pdf")
async def analyze_pdf_endpoint(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    contents = await file.read()
    results = analyze_pdf(contents)
    return results

@app.post("/analyze/audio")
async def analyze_audio_endpoint(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".wav"):
        raise HTTPException(status_code=400, detail="File must be a WAV audio")
    contents = await file.read()
    results = analyze_audio(contents)
    return results

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
