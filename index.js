// RETRO ARCADE // ROULETTE
// Single-file Node.js app, no dependencies. Run: node index.js  ->  http://localhost:8080

const http = require("http");

const PORT = process.env.PORT || 8080;
const startTime = Date.now();

const games = [
  { id: 1, title: "Neon Racer", genre: "Racing", year: 1989, description: "Drift through a glowing city at midnight.", c1: "#4c1d95", c2: "#0f172a", accent: "#f0abfc" },
  { id: 2, title: "Pixel Quest", genre: "Adventure", year: 1992, description: "Explore dungeons and collect forgotten relics.", c1: "#14532d", c2: "#052e16", accent: "#86efac" },
  { id: 3, title: "Galaxy Defender", genre: "Shooter", year: 1984, description: "Hold the line against waves of alien invaders.", c1: "#1e3a8a", c2: "#020617", accent: "#38bdf8" },
  { id: 4, title: "Block Drop", genre: "Puzzle", year: 1987, description: "Stack falling shapes before the board fills up.", c1: "#7c2d12", c2: "#1c1917", accent: "#fdba74" },
  { id: 5, title: "Turbo Brawl", genre: "Fighting", year: 1994, description: "Pick a fighter and win the street tournament.", c1: "#7f1d1d", c2: "#1c1917", accent: "#fca5a5" },
  { id: 6, title: "Cave Jumper", genre: "Platformer", year: 1990, description: "Leap across lava pits and hidden ledges.", c1: "#78350f", c2: "#1c1917", accent: "#fcd34d" },
  { id: 7, title: "Ghost Maze", genre: "Puzzle", year: 1980, description: "Eat every dot while dodging four ghosts.", c1: "#1e1b4b", c2: "#000000", accent: "#facc15" },
  { id: 8, title: "Star Pilot", genre: "Shooter", year: 1996, description: "Fly a lone fighter through an asteroid belt.", c1: "#0c4a6e", c2: "#1e1b4b", accent: "#67e8f9" }
];

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>RETRO ARCADE // ROULETTE</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    min-height: 100vh;
    background: radial-gradient(circle at top, #2e1065, #0b0618 60%);
    color: #f5f3ff;
    font-family: "Courier New", monospace;
    padding: 30px 6%;
  }
  header { text-align: center; margin-bottom: 30px; }
  h1 { font-size: clamp(1.8rem, 5vw, 3rem); letter-spacing: 4px; color: #f0abfc; text-shadow: 0 0 14px #c026d3; }
  .sub { color: #a78bfa; margin-top: 8px; }
  .uptime { color: #64748b; font-size: .85rem; margin-top: 6px; }
  .stage { max-width: 420px; margin: 0 auto 34px; text-align: center; }
  .screen {
    aspect-ratio: 2 / 3; border-radius: 14px; border: 2px solid #f0abfc;
    box-shadow: 0 0 30px rgba(192,38,211,.5); display: flex; flex-direction: column;
    justify-content: flex-end; padding: 22px; margin-bottom: 18px; transition: background .12s;
    background: linear-gradient(160deg, #312e81, #0b0618);
  }
  .screen h2 { font-size: 1.7rem; letter-spacing: 2px; margin-bottom: 6px; }
  .screen p { color: #ddd6fe; }
  .screen .meta { font-size: .8rem; letter-spacing: 3px; margin-bottom: 8px; }
  button {
    font: inherit; cursor: pointer; border-radius: 10px; padding: 12px 22px; font-weight: 700;
    background: #c026d3; color: #fff; border: none; margin: 4px; letter-spacing: 2px;
  }
  button.alt { background: transparent; border: 1px solid #a78bfa; color: #ddd6fe; }
  button:hover { filter: brightness(1.2); }
  button:disabled { opacity: .5; cursor: wait; }
  .toolbar { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; margin-bottom: 22px; }
  .chip { padding: 6px 14px; border-radius: 999px; border: 1px solid #6d28d9; cursor: pointer; color: #c4b5fd; }
  .chip.active { background: #6d28d9; color: #fff; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; max-width: 1000px; margin: 0 auto; }
  .card { border: 1px solid #4c1d95; border-radius: 12px; padding: 16px; background: rgba(15,10,35,.8); }
  .card h3 { margin: 4px 0; }
  .card small { color: #a78bfa; }
  .card p { color: #c4b5fd; margin-top: 8px; font-size: .9rem; }
  .history { max-width: 420px; margin: 0 auto 30px; color: #a78bfa; font-size: .9rem; text-align: center; }
  footer { text-align: center; color: #64748b; margin-top: 40px; font-size: .85rem; }
</style>
</head>
<body>
<header>
  <h1>ARCADE ROULETTE</h1>
  <div class="sub">Can't decide what to play? Let fate pick.</div>
  <div class="uptime">SERVER UPTIME <span id="uptime">00:00:00</span></div>
</header>

<section class="stage">
  <div class="screen" id="screen">
    <div class="meta" id="meta">PRESS START</div>
    <h2 id="title">???</h2>
    <p id="desc">Spin the roulette to get a random game.</p>
  </div>
  <button id="spin">SPIN</button>
  <button class="alt" id="clear">CLEAR HISTORY</button>
</section>

<div class="history" id="history"></div>

<div class="toolbar" id="filters"></div>
<div class="grid" id="grid"></div>

<footer>RETRO ARCADE // ROULETTE • Built with plain Node.js</footer>

<script>
  const games = ${JSON.stringify(games)};
  let genre = "All";
  let history = [];
  try { history = JSON.parse(localStorage.getItem("arcadeHistory") || "[]"); } catch (e) { history = []; }
  if (!Array.isArray(history)) history = [];

  const $ = (id) => document.getElementById(id);

  function show(g) {
    $("screen").style.background = "linear-gradient(160deg," + g.c1 + "," + g.c2 + ")";
    $("screen").style.borderColor = g.accent;
    $("meta").textContent = g.genre.toUpperCase() + " • " + g.year;
    $("meta").style.color = g.accent;
    $("title").textContent = g.title.toUpperCase();
    $("desc").textContent = g.description;
  }

  function pool() {
    return games.filter((g) => genre === "All" || g.genre === genre);
  }

  function renderHistory() {
    $("history").textContent = history.length
      ? "Recent picks: " + history.slice(-5).reverse().join(" → ")
      : "No spins yet.";
  }

  function spin() {
    const list = pool();
    if (!list.length) return;
    $("spin").disabled = true;
    let ticks = 0;
    const timer = setInterval(() => {
      show(list[Math.floor(Math.random() * list.length)]);
      ticks++;
      if (ticks > 14) {
        clearInterval(timer);
        const pick = list[Math.floor(Math.random() * list.length)];
        show(pick);
        history.push(pick.title);
        history = history.slice(-20);
        try { localStorage.setItem("arcadeHistory", JSON.stringify(history)); } catch (e) {}
        renderHistory();
        $("spin").disabled = false;
      }
    }, 80);
  }

  function renderFilters() {
    const genres = ["All", ...new Set(games.map((g) => g.genre))];
    $("filters").innerHTML = "";
    genres.forEach((name) => {
      const chip = document.createElement("span");
      chip.className = "chip" + (name === genre ? " active" : "");
      chip.textContent = name;
      chip.addEventListener("click", () => { genre = name; renderFilters(); renderGrid(); });
      $("filters").appendChild(chip);
    });
  }

  function renderGrid() {
    $("grid").innerHTML = "";
    pool().forEach((g) => {
      const card = document.createElement("article");
      card.className = "card";
      card.style.borderColor = g.accent;
      const small = document.createElement("small");
      small.textContent = g.genre + " • " + g.year;
      const h3 = document.createElement("h3");
      h3.textContent = g.title;
      const p = document.createElement("p");
      p.textContent = g.description;
      card.append(small, h3, p);
      $("grid").appendChild(card);
    });
  }

  function tickUptime() {
    fetch("/api/status").then((r) => r.json()).then((d) => {
      const s = d.uptimeSeconds;
      const pad = (n) => String(n).padStart(2, "0");
      $("uptime").textContent = pad(Math.floor(s / 3600)) + ":" + pad(Math.floor((s % 3600) / 60)) + ":" + pad(s % 60);
    }).catch(() => {});
  }

  $("spin").addEventListener("click", spin);
  $("clear").addEventListener("click", () => {
    history = [];
    try { localStorage.removeItem("arcadeHistory"); } catch (e) {}
    renderHistory();
  });

  renderFilters();
  renderGrid();
  renderHistory();
  tickUptime();
  setInterval(tickUptime, 1000);
</script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  const url = (req.url || "/").split("?")[0];

  if (url === "/api/status") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, uptimeSeconds: Math.floor((Date.now() - startTime) / 1000) }));
    return;
  }

  if (url === "/api/games") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(games));
    return;
  }

  if (url === "/api/random") {
    const pick = games[Math.floor(Math.random() * games.length)];
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(pick));
    return;
  }

  if (url === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log("Arcade Roulette running on http://localhost:" + PORT);
});
