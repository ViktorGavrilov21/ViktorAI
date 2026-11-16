from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import httpx, json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/generate")
async def generate(request: Request):
    raw_body = await request.body()
    body = json.loads(raw_body)
    body["stream"] = True

    async def stream_from_ollama():
        async with httpx.AsyncClient(timeout=None) as client:
            async with client.stream("POST", "http://127.0.0.1:11434/api/generate", json=body) as resp:
                async for chunk in resp.aiter_bytes():
                    yield chunk

    return StreamingResponse(stream_from_ollama(), media_type="application/x-ndjson")
