const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

// Friendly root
app.get("/", (req, res) => {
  res.send("Gamepass backend is alive! Use /passes/:userId");
});

// Actual gamepass route
app.get("/passes/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const r = await fetch(
      `https://apis.roblox.com/game-passes/v1/users/${userId}/game-passes?count=100`,
      { headers: { "User-Agent": "RobloxProxy" } }
    );

    const data = await r.json();

    const passes = data.data
      .filter(p => p.price && p.price > 0)
      .map(p => ({ id: p.id, price: p.price }))
      .sort((a, b) => a.price - b.price);

    res.json(passes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch passes" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
