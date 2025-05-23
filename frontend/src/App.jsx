import { useState } from "react";
import logo from "./assets/playbotka-logo.png";

const MATERIALS = {
  indoor: [
    { name: "cardboard", icon: "📦" },
    { name: "glue", icon: "🩴" },
    { name: "scissors", icon: "✂️" },
    { name: "buttons", icon: "🔘" },
    { name: "pencils", icon: "✏️" },
    { name: "cups", icon: "🥤" },
  ],
  outdoor: [
    { name: "leaves", icon: "🍃" },
    { name: "sticks", icon: "🩵" },
    { name: "stones", icon: "🨨" },
    { name: "pinecones", icon: "🌰" },
    { name: "flowers", icon: "🌸" },
    { name: "chalk", icon: "🖍️" },
  ],
};

function App() {
  const [form, setForm] = useState({
    location: "indoor",
    materials: [],
    goal: "creativity",
    time: 15,
  });

  const [conversation, setConversation] = useState([
    { role: "system", content: "You're a helpful assistant suggesting creative activities for kids based on context." }
  ]);
  const [question, setQuestion] = useState("");
  const [idea, setIdea] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMaterialChange = (name) => {
    const updated = form.materials.includes(name)
      ? form.materials.filter((m) => m !== name)
      : [...form.materials, name];
    setForm({ ...form, materials: updated });
  };

  const handleCustomMaterials = (e) => {
    const input = e.target.value;
    const split = input.split(",").map((s) => s.trim()).filter(Boolean);
    setForm({ ...form, materials: [...form.materials, ...split] });
  };

  const handleUserAnswer = async () => {
    if (!userAnswer.trim()) return;
    const updatedConversation = [...conversation, { role: "user", content: userAnswer }];
    setConversation(updatedConversation);
    setUserAnswer("");
    await fetchNextStep(updatedConversation);
  };

  const handleSubmit = async () => {
    const materialsList = form.materials.join(", ") || "some materials";
    const context = `Location: ${form.location}, Time: ${form.time} min, Goal: ${form.goal}, Materials: ${materialsList}`;
    const updatedConversation = [...conversation, { role: "user", content: context }];
    setConversation(updatedConversation);
    await fetchNextStep(updatedConversation);
  };

  const fetchNextStep = async (messages) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });
      const data = await response.json();
      const reply = data.reply;

      if (
        typeof reply === "object" &&
        reply !== null &&
        (reply.title || (reply.steps && reply.steps.length))
      ) {
        setIdea(reply);
        setQuestion("");
      } else if (typeof reply === "object" && reply.raw) {
        setQuestion(reply.raw);
        setConversation([...messages, { role: "assistant", content: reply.raw }]);
      } else if (typeof reply === "string") {
        setQuestion(reply);
        setConversation([...messages, { role: "assistant", content: reply }]);
      } else {
        console.warn("Unexpected reply format:", reply);
      }
    } catch (error) {
      console.error("Failed to fetch from backend", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-10 px-4 bg-orange-50">
      <img
        src={logo}
        alt="PlayBotka"
        className="w-24 h-24 rounded-full mb-4 border-4 border-orange-300 shadow-lg"
      />
      <h1 className="text-4xl font-bold text-orange-600 mb-2">🎨 PlayBotka</h1>
      <p className="text-lg text-gray-700 mb-6 text-center max-w-md">
        Let's find a creative activity for you and your child!
      </p>

      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md space-y-4 border border-orange-200">
        <div>
          <label className="block text-sm font-semibold mb-1">📍 Location</label>
          <select name="location" value={form.location} onChange={handleChange} className="w-full p-2 rounded-xl border">
            <option value="indoor">Indoor</option>
            <option value="outdoor">Outdoor</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">🧶 Materials</label>
          <div className="grid grid-cols-2 gap-2">
            {(MATERIALS[form.location] || []).map(({ name, icon }) => (
              <label key={name} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={name}
                  checked={form.materials.includes(name)}
                  onChange={() => handleMaterialChange(name)}
                />
                <span className="text-sm">{icon} {name}</span>
              </label>
            ))}
          </div>
          <input
            type="text"
            placeholder="Add custom materials..."
            className="mt-3 w-full p-2 rounded-xl border border-gray-300"
            onBlur={handleCustomMaterials}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">🎯 Goal</label>
          <select name="goal" value={form.goal} onChange={handleChange} className="w-full p-2 rounded-xl border">
            <option value="creativity">Creativity</option>
            <option value="language">Language development</option>
            <option value="motor skills">Motor skills</option>
            <option value="calm activity">Calm activity</option>
            <option value="energy release">Burn energy</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">⏱️ Time (minutes)</label>
          <input type="number" name="time" value={form.time} onChange={handleChange} className="w-full p-2 rounded-xl border" />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-orange-400 hover:bg-orange-500 text-white py-2 rounded-full font-bold shadow-md transition"
        >
          🌟 Get Personalized Activity
        </button>
      </div>

      {question && (
        <div className="mt-6 bg-white p-6 border rounded-xl shadow-md max-w-md w-full space-y-4">
          <p className="font-semibold">🤖 {question}</p>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUserAnswer()}
            placeholder="Type your answer..."
            className="w-full p-2 rounded-xl border border-gray-300"
          />
          <button
            onClick={handleUserAnswer}
            className="bg-orange-300 hover:bg-orange-400 text-white px-4 py-2 rounded-full font-bold"
          >
            Reply
          </button>
        </div>
      )}

      {isLoading && <p className="mt-4 text-sm text-gray-500 italic">Thinking...</p>}

      {idea && (
        <div className="mt-8 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-xl max-w-md shadow space-y-2">
          <p className="font-semibold text-lg">💡 {idea.title || "Activity Idea"}</p>
          {idea.materials && <p><strong>Materials:</strong> {idea.materials}</p>}
          {idea.time && <p><strong>Time needed:</strong> {idea.time}</p>}
          {idea.messLevel && <p><strong>Mess level:</strong> {idea.messLevel}</p>}
          {idea.steps && idea.steps.length > 0 && (
            <div>
              <strong>Steps:</strong>
              <ol className="list-decimal list-inside">
                {idea.steps.map((step, idx) => (
                  <li key={idx}>{step.replace(/^\d+\.\s*/, '')}</li>
                ))}
              </ol>
            </div>
          )}
          <button
            onClick={() => {
            setIdea(null);
            fetchNextStep(conversation);
          }}
            className="mt-4 bg-orange-300 hover:bg-orange-400 text-white px-4 py-2 rounded-full font-bold"
          >
            🔁 Regenerate Idea
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
