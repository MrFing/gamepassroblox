import express from "express";
import fetch from "node-fetch";

const app = express();
const cache = new Map();

app.get("/gamepasses", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).send("Missing userId");

  if (cache.has(userId)) return res.json(cache.get(userId));

  const url = `https://apis.roblox.com/game-passes/v1/users/${userId}/game-passes?count=100`;
  const response = await fetch(url);
  const data = await response.json();

  const passes = data.data
    .filter(p => p.price && p.price > 0)
    .map(p => ({ id: p.id, price: p.price }))
    .sort((a, b) => a.price - b.price);

  cache.set(userId, passes);
  setTimeout(() => cache.delete(userId), 300000);

  res.json(passes);
});

app.listen(process.env.PORT || 3000);
