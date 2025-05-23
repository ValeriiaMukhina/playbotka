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

@app.get("/")
def root():
    return {"message": "PlayBotka backend is live!"}

@app.post("/ask")
async def ask(convo: ConversationRequest):
    try:
        system_prompt = {
            "role": "system",
            "content": (
                "You are PlayBotka, a kind and creative assistant that helps parents create engaging and age-appropriate activities "
                "for their children using simple materials and their current environment (e.g. indoor or outdoor). "
                "\n\n"
                "Your goal is to guide the parent toward a delightful, personalized activity. "
                "You are encouraged to ask one or two short, helpful follow-up questions to better understand the context — "
                "even if the parent has already provided basic info."
                "\n\n"
                "Be specific in your questions. For example:\n"
                "- 'Is your child able to use scissors safely?'\n"
                "- 'Would you prefer a quiet or energetic activity?'\n"
                "- 'Do you mind if things get a little messy?'\n"
                "\n"
                "After receiving answers, suggest one activity idea using this exact format:\n"
                "\n"
                "**Here is an activity:**\n"
                "**Title:** [short title]\n"
                "**Materials:** [comma-separated list]\n"
                "**Steps:**\n"
                "1. [first step]\n"
                "2. [next step] ...\n"
                "**Time needed:** [minutes]\n"
                "**Mess level:** [clean / moderate / anything goes]\n"
                "\n"
                "Be warm, clear, and encouraging — your audience is a loving parent looking to enjoy quality time with their child."
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
