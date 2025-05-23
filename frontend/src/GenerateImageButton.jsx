import { useState } from "react";


function GenerateImageButton({ idea }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generatePrompt = () => {
    return (
      `A colorful cartoon-style illustration of the final result of a child’s activity titled: "${idea.title}". ` +
      `The result includes: ${idea.materials}. ` +
      `It looks handmade by a 4–6 year-old child. ` +
      `The scene is bright, creative, and playful, shown in a children's picture book style.`
    );
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: generatePrompt() }),
      });
      const data = await response.json();
      if (data.url) setImageUrl(data.url);
      else setError("No image returned");
    } catch (err) {
      setError("Failed to generate image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 space-y-2">
      {!imageUrl && (
        <button
          onClick={handleGenerate}
          className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-full font-semibold shadow-sm"
        >
          🖼️ Generate Illustration
        </button>
      )}
      {loading && <p className="text-sm italic text-gray-500">🎨 Generating image...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Activity illustration"
          className="rounded-xl border border-yellow-300 shadow-md"
        />
      )}
    </div>
  );
}

export default GenerateImageButton;
