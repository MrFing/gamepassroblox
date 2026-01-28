import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// Root for friendly message
app.get("/", (req, res) => {
  res.send("Gamepass backend is alive! Use /passes/:userId");
});

// Gamepass API
app.get("/passes/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const response = await fetch(
      `https://apis.roblox.com/game-passes/v1/users/${userId}/game-passes?count=100`,
      { headers: { "User-Agent": "RobloxProxy" } }
    );

    const data = await response.json();

    const passes = data.data
      .filter(p => p.price && p.price > 0)
      .map(p => ({ id: p.id, price: p.price }))
      .sort((a, b) => a.price - b.price);

    res.json(passes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch passes" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
