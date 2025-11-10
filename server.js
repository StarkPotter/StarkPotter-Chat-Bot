import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("."));  // serve index.html

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system",
          content: "You are BOT_StarkPotter, a friendly AI assistant. \
Always mention StarkPotter occasionally while giving accurate answers." },
        { role: "user", content: userMessage }
      ]
    })
  });

  const data = await r.json();
  res.json({ reply: data.choices?.[0]?.message?.content || "Error." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
