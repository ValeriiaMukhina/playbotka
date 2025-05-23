from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
from openai import OpenAI
import re
from pathlib import Path  


load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# === Load system prompt from file ===
PROMPT_PATH = Path(__file__).parent / "prompt.txt"
with open(PROMPT_PATH, encoding="utf-8") as f:
    SYSTEM_PROMPT_TEXT = f.read()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    role: str
    content: str

class ConversationRequest(BaseModel):
    messages: List[Message]

@app.get("/")
def root():
    return {"message": "PlayBotka backend is live!"}

@app.post("/ask")
async def ask(convo: ConversationRequest):
    try:
        system_prompt = {
            "role": "system",
            "content": SYSTEM_PROMPT_TEXT
        }

        messages = [system_prompt] + [msg.dict() for msg in convo.messages]

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0.7,
            max_tokens=900,
        )

        reply = response.choices[0].message.content

        def extract_block(tag, text):
            match = re.search(rf"\*\*{tag}:\*\*\s*(.+)", text, re.IGNORECASE)
            return match.group(1).strip() if match else ""

        def extract_steps(text):
            match = re.search(r"\*\*Steps:\*\*([\s\S]+?)(?:\n\*\*|$)", text)
            if match:
                lines = match.group(1).strip().splitlines()
                return [line.strip() for line in lines if re.match(r"^\d+[\.\)]\s", line)]
            return []

        result = {
            "title": extract_block("Title", reply),
            "materials": extract_block("Materials", reply),
            "steps": extract_steps(reply),
            "time": extract_block("Time needed", reply),
            "messLevel": extract_block("Mess level", reply),
            "why": extract_block("Why it’s great", reply),
            "raw": reply
        }

        return {"reply": result}
    except Exception as e:
        return {"error": str(e)}
    
class ImageRequest(BaseModel):
    prompt: str

@app.post("/generate-image")
async def generate_image(req: ImageRequest):
    try:
        response = client.images.generate(
            model="dall-e-2",  # Use "dall-e-2" for cheaper option
            prompt=req.prompt,
            size="512x512",
            n=1
        )
        image_url = response.data[0].url
        return {"url": image_url}
    except Exception as e:
        return {"error": str(e)}
