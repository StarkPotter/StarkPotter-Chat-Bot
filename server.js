import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("."));

// 🧠 store last few messages in memory
let chatHistory = [
  {
    role: "system",
    content:
      "You are BOT_StarkPotter, a friendly AI assistant who always talks about StarkPotter in a helpful, casual way. Be fun, informative, and detailed.",
  },
];

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;
  chatHistory.push({ role: "user", content: userMessage });

  // Limit memory to last 10 messages
  if (chatHistory.length > 12) chatHistory = chatHistory.slice(-12);

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: chatHistory,
      }),
    });

    const data = await r.json();
    const reply = data.choices?.[0]?.message?.content || "Error.";

    // store reply in history
    chatHistory.push({ role: "assistant", content: reply });

    res.json({ reply });
  } catch (err) {
    console.error("Error:", err);
    res.json({ reply: "Something went wrong while contacting StarkPotter HQ 😅" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
