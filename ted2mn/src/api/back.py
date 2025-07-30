from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from enum import Enum
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Fix CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

class Language(str, Enum):
    English = 'English'
    Mongolian = 'Mongolian'

@app.get("/")
async def root():
    return {"message": "Ted2mn API is running"}

@app.options("/analyze")
async def options_analyze():
    return JSONResponse(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        }
    )

@app.post("/analyze")
async def analyze(
    source_lang: str = Form(...),
    target_lang: str = Form(...),
    file: UploadFile = File(None),
    url: str = Form(None),
):
    try:
        logger.info(f"Received request - source_lang: {source_lang}, target_lang: {target_lang}")
        
        if not file and not url:
            raise HTTPException(status_code=400, detail='You must provide either a file or a URL.')

        if file:
            logger.info(f"File received: {file.filename}, size: {file.size}, content_type: {file.content_type}")
            
            # Read file content (for validation)
            content = await file.read()
            logger.info(f"File content length: {len(content)} bytes")
            
            # Reset file pointer for future use
            await file.seek(0)
            
            # Here you would process the file
            # For now, just return success
            return {
                "status": "success",
                "message": "File uploaded successfully",
                "source_language": source_lang,
                "target_language": target_lang,
                "filename": file.filename,
                "file_size": len(content)
            }
        
        if url:
            logger.info(f"URL received: {url}")
            return {
                "status": "success",
                "message": "URL received successfully",
                "source_language": source_lang,
                "target_language": target_lang,
                "url": url
            }
            
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("back:app", host="0.0.0.0", port=8002, reload=True)
