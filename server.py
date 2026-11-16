from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
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
    body["stream"] = False
    async with httpx.AsyncClient(timeout=300.0) as client:
        resp = await client.post("http://127.0.0.1:11434/api/generate", json=body)
        return resp.json()
