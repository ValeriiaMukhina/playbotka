# 🎨 PlayBotka

**PlayBotka** is a friendly AI assistant that helps parents find fun, creative, and age-appropriate activities to do with their children using simple materials — at home or outside.

## ✨ Features

- 🤖 Agentic AI assistant using OpenAI's GPT
- 🧶 Suggests structured activities with title, materials, steps, and time
- 🎨 Tailwind + React frontend
- 🚀 FastAPI backend with OpenAI integration
- 🔁 Follow-up questions and regenerate ideas

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
