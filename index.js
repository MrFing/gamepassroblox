import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// Root endpoint - friendly message
app.get("/", (req, res) => {
  res.send("Gamepass backend is alive! Use /passes/:userId");
});

// Gamepass endpoint
app.get("/passes/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    // RoProxy endpoint to fetch all gamepasses of a user
    const response = await fetch(
      `https://api.roproxy.com/game-passes/v1/users/${userId}/game-passes?count=100`
    );

    if (!response.ok) {
      console.error("Failed fetch:", response.status, response.statusText);
      return res.status(500).json({ error: "Failed to fetch passes from RoProxy" });
    }

    const data = await response.json();

    // Filter passes with price > 0 and sort by price ascending
    const passes = data.data
      .filter(p => p.price && p.price > 0)
      .map(p => ({
        id: p.id,
        name: p.name,
        price: p.price
      }))
      .sort((a, b) => a.price - b.price);

    res.json(passes);

  } catch (err) {
    console.error("Error fetching passes:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

