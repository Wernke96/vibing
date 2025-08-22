
import React, { useState, useEffect } from "react";

type ChatRole = "user" | "assistant";
interface ChatGptAskProps {
  region: string;
}

const ChatGptAsk: React.FC<ChatGptAskProps> = ({ region }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: ChatRole; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset chat context when region changes
  useEffect(() => {
    setMessages([]);
    setInput("");
    setError(null);
  }, [region]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  const newMessages = [...messages, { role: "user" as ChatRole, content: input }];
  setMessages(newMessages);
    setInput("");
    try {
      const res = await fetch("/api/chatgpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: newMessages.map(m => m.content).join("\n"), region }),
      });
      const data = await res.json();
      if (data.result) {
        setMessages([...newMessages, { role: "assistant" as ChatRole, content: data.result }]);
      } else setError(data.error || "Unknown error");
    } catch (err) {
      setError("Failed to fetch response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mt-6 p-4 bg-white/70 rounded-xl shadow">
      <form onSubmit={handleAsk} className="flex flex-col gap-2">
        <label className="font-semibold text-sm text-gray-700">
          Ask ChatGPT about this region:
        </label>
        <div className="flex gap-2">
          <input
            className="flex-1 border rounded px-3 py-2 text-sm focus:outline-pink-400 bg-white text-black"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={`e.g. What are fun things to do in ${region}?`}
            required
          />
          <button
            type="submit"
            className="bg-pink-500 text-white px-4 py-2 rounded font-semibold hover:bg-pink-600 transition"
            disabled={loading}
          >
            {loading ? "Asking..." : "Ask"}
          </button>
        </div>
      </form>
      <div className="mt-4 flex flex-col gap-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={
              msg.role === "user"
                ? "self-end bg-pink-100 text-black px-3 py-2 rounded-lg max-w-[90%] text-sm"
                : "self-start bg-blue-50 border-l-4 border-blue-400 text-black px-3 py-2 rounded-lg max-w-[90%] text-sm whitespace-pre-line"
            }
          >
            {msg.content}
          </div>
        ))}
      </div>
      {error && (
        <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-400 rounded text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
};

export default ChatGptAsk;
