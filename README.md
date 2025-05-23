# 🎨 PlayBotka

**PlayBotka** is a friendly AI assistant that helps parents find fun, creative, and age-appropriate activities to do with their children using simple materials — at home or outside.

## ✨ Features

- 🤖 Agentic AI assistant using OpenAI's GPT
- 🧶 Suggests structured activities with title, materials, steps, and time
- 🎨 Tailwind + React frontend
- 🚀 FastAPI backend with OpenAI integration
- 🔁 Follow-up questions and regenerate ideas

## 🤖 Why PlayBotka is Agentic

PlayBotka is more than a chatbot — it’s an **agentic AI assistant** that takes initiative to help parents create meaningful moments with their children. It behaves like an intelligent helper, not just a responder.

### ✅ Agentic Qualities

| Feature                          | Description |
|----------------------------------|-------------|
| 🎯 **Goal-directed behavior**     | Always works toward suggesting the most suitable creative activity for a given situation |
| 🧠 **Context-aware questioning**  | Asks clarifying follow-up questions if user input is incomplete or vague |
| ⚖️ **Constraint-based decisions** | Balances materials, time, energy level, and messiness to craft tailored suggestions |
| 📋 **Structured output**         | Returns well-formatted ideas (title, steps, materials, time, mess level) that frontend can render cleanly |
| 🔁 **Multi-turn interaction**     | Guides users over multiple steps to refine and personalize the activity |

This makes PlayBotka a **true assistant** — not just a prompt-to-text tool.

---

## 🗂️ Project Structure

```
my-project/
├── backend/   # FastAPI app with OpenAI
│   └── main.py, requirements.txt
├── frontend/  # React + Tailwind UI
│   └── src/App.jsx, package.json
└── README.md
```

---

## 💻 Running Locally

### 1. Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate   # or 'venv\Scripts\activate' on Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

Make sure to create a `.env` file with:

```
OPENAI_API_KEY=your_openai_key_here
```

Runs at: `http://localhost:8000`

---

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Runs at: `http://localhost:5173`

---

## 🧰 Technologies Used

- React 19 + Vite
- Tailwind CSS
- FastAPI
- OpenAI API
- Python-dotenv

---

## 🐙 Deployment

You can deploy this project using platforms like:
- **Vercel** or **Netlify** (for frontend)
- **Render**, **Railway**, or **Fly.io** (for backend)

---

## 🧠 Future Ideas

- 🖼️ Generate activity images (DALL·E)
- 💾 Save and view past activities
- 🗣️ Multilingual support

---

Made with 💛 by Valeriia.
