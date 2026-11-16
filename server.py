from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import httpx

app = FastAPI()

# Разрешаем запросы с любого сайта (убивает CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/generate")
async def generate(request: Request):
    body = await request.json()
    
    async def stream_from_ollama():
        async with httpx.AsyncClient(timeout=None) as client:
            async with client.stream("POST", "http://127.0.0", json=body) as resp:
                async for chunk in resp.aiter_bytes():
                    yield chunk

    return StreamingResponse(stream_from_ollama(), media_type="application/x-ndjson")