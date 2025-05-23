from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
from openai import OpenAI
import re

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


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

@app.post("/ask")
async def ask(convo: ConversationRequest):
    try:
        system_prompt = {
            "role": "system",
            "content": (
                "You are PlayBotka, a kind and creative assistant that helps parents create engaging and age-appropriate activities "
                "for their children using simple materials and their current environment (e.g. indoor or outdoor). "
                "\n\n"
                "Your goal is to gently guide the parent toward a complete, fun activity suggestion. You may ask 1–2 follow-up questions, "
                "but only if absolutely necessary. When you do ask questions, they must be specific and helpful — avoid vague questions like "
                "'What else do you have?'. Instead, ask questions such as: "
                "'Is your child able to use scissors safely?', 'Would you prefer a quiet or energetic activity?', or "
                "'Do you mind if things get a little messy?'."
                "\n\n"
                "When you have enough information, reply with a single activity idea in the following structured format (as plain text):\n"
                "\n"
                "**Here is an activity:**\n"
                "**Title:** [short title]\n"
                "**Materials:** [comma-separated list of items needed]\n"
                "**Steps:**\n"
                "1. [step one]\n"
                "2. [step two]\n"
                "...\n"
                "**Time needed:** [number of minutes]\n"
                "**Mess level:** [clean / moderate / anything goes]\n"
                "\n"
                "Be cheerful, simple, and warm — your audience is a caring parent who wants to bond with their child."
            )
        }

        messages = [system_prompt] + [msg.dict() for msg in convo.messages]

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0.7,
            max_tokens=700,
        )

        reply = response.choices[0].message.content

        # Try to extract structured content
        def extract_block(tag, text):
            match = re.search(rf"\*\*{tag}:\*\* (.+?)\n", text)
            return match.group(1).strip() if match else ""

        def extract_steps(text):
            steps_block = re.findall(r"\*\*Steps:\*\*[\r\n]+(.*?)\n\*\*", text, re.DOTALL)
            if not steps_block:
                steps_block = re.findall(r"\*\*Steps:\*\*[\r\n]+(.*)", text, re.DOTALL)
            if steps_block:
                return [line.strip() for line in steps_block[0].split("\n") if line.strip().startswith("1") or line.strip().startswith("2") or line.strip().startswith("3")]
            return []

        result = {
            "title": extract_block("Title", reply),
            "materials": extract_block("Materials", reply),
            "steps": extract_steps(reply),
            "time": extract_block("Time needed", reply),
            "messLevel": extract_block("Mess level", reply),
            "raw": reply
        }

        return {"reply": result}
    except Exception as e:
        return {"error": str(e)}
