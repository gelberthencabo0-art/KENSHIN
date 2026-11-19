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
  .screen { position: relative; overflow: hidden; }
  .screen > .art, .thumb { position: absolute; inset: 0; }
  .screen > .art svg, .thumb svg { width: 100%; height: 100%; display: block; }
  .screen > .art::after { content: ""; position: absolute; inset: 0; background: linear-gradient(to top, rgba(5,2,15,.9), rgba(5,2,15,0) 65%); }
  .screen > *:not(.art) { position: relative; z-index: 2; }
  .thumb { position: relative; aspect-ratio: 3 / 2; border-radius: 8px; overflow: hidden; margin-bottom: 10px; }
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
    <div class="art" id="art"></div>
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

  // Generated artwork. If a game has an "image" URL it is used instead.
  const kinds = { 1: "road", 2: "dungeon", 3: "space", 4: "blocks", 5: "burst", 6: "hills", 7: "maze", 8: "space" };
  let uid = 0;

  function rng(seed) {
    let s = seed * 9301 + 49297;
    return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  }

  function artSVG(g) {
    const R = rng(g.id * 7 + 3);
    const id = "g" + g.id + "_" + (uid++);
    const a = g.accent;
    let s = '<svg viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">';
    s += '<defs><linearGradient id="b' + id + '" x1="0" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="' + g.c1 + '"/><stop offset="1" stop-color="' + g.c2 + '"/></linearGradient>';
    s += '<radialGradient id="o' + id + '"><stop offset="0" stop-color="' + a + '" stop-opacity="0.95"/><stop offset="1" stop-color="' + a + '" stop-opacity="0"/></radialGradient></defs>';
    s += '<rect width="200" height="300" fill="url(#b' + id + ')"/>';
    for (let i = 0; i < 40; i++) {
      s += '<circle cx="' + (R() * 200).toFixed(1) + '" cy="' + (R() * 170).toFixed(1) + '" r="' + (R() + 0.3).toFixed(2) + '" fill="#fff" opacity="' + (0.25 + R() * 0.6).toFixed(2) + '"/>';
    }
    const k = kinds[g.id];
    if (k === "road") {
      s += '<circle cx="100" cy="120" r="60" fill="url(#o' + id + ')"/><circle cx="100" cy="120" r="30" fill="' + a + '"/>';
      s += '<polygon points="0,300 200,300 120,150 80,150" fill="#0b0618"/>';
      for (let y = 160; y < 300; y += 26) { const w = 1 + (y - 150) / 40; s += '<rect x="' + (100 - w / 2) + '" y="' + y + '" width="' + w + '" height="14" fill="' + a + '"/>'; }
    } else if (k === "dungeon") {
      for (let i = 0; i < 6; i++) { s += '<rect x="' + (10 + i * 30) + '" y="' + (150 + (i % 2) * 20) + '" width="24" height="150" fill="#052e16" opacity="0.9"/>'; }
      s += '<path d="M70 300 V190 Q100 140 130 190 V300Z" fill="#000" opacity="0.8"/><circle cx="100" cy="215" r="10" fill="' + a + '"/>';
    } else if (k === "space") {
      s += '<circle cx="150" cy="70" r="30" fill="url(#o' + id + ')"/>';
      for (let i = 0; i < 5; i++) { s += '<ellipse cx="' + (20 + R() * 160) + '" cy="' + (120 + R() * 100) + '" rx="' + (8 + R() * 12) + '" ry="' + (6 + R() * 8) + '" fill="#334155" stroke="' + a + '" stroke-opacity="0.6"/>'; }
      s += '<polygon points="100,230 88,265 100,258 112,265" fill="' + a + '"/>';
    } else if (k === "blocks") {
      const cols = [a, "#fb7185", "#a78bfa", "#34d399"];
      for (let r = 0; r < 8; r++) for (let c = 0; c < 5; c++) {
        if (R() > 0.35) s += '<rect x="' + (25 + c * 30) + '" y="' + (120 + r * 22) + '" width="26" height="18" rx="3" fill="' + cols[Math.floor(R() * 4)] + '" opacity="0.9"/>';
      }
    } else if (k === "burst") {
      for (let i = 0; i < 24; i++) { const ang = i / 24 * Math.PI * 2; s += '<line x1="100" y1="140" x2="' + (100 + Math.cos(ang) * 150).toFixed(1) + '" y2="' + (140 + Math.sin(ang) * 150).toFixed(1) + '" stroke="' + a + '" stroke-width="3" opacity="0.35"/>'; }
      s += '<circle cx="100" cy="140" r="34" fill="' + a + '"/><circle cx="100" cy="140" r="16" fill="#fff"/>';
    } else if (k === "hills") {
      s += '<circle cx="150" cy="80" r="26" fill="' + a + '"/>';
      s += '<path d="M0 220 Q50 150 100 210 T200 190 V300 H0Z" fill="#451a03"/><path d="M0 260 Q60 220 120 255 T200 240 V300 H0Z" fill="#1c0a02"/>';
      s += '<rect x="60" y="205" width="14" height="18" fill="' + a + '"/>';
    } else if (k === "maze") {
      for (let i = 0; i < 6; i++) { s += '<rect x="' + (15 + i * 5) + '" y="' + (110 + i * 5) + '" width="' + (170 - i * 10) + '" height="' + (130 - i * 10) + '" fill="none" stroke="#3b82f6" stroke-width="3" rx="8" opacity="' + (0.9 - i * 0.12).toFixed(2) + '"/>'; }
      s += '<path d="M100 175 L130 160 A30 30 0 1 1 130 190Z" fill="' + a + '"/>';
    }
    s += '<rect x="6" y="6" width="188" height="288" fill="none" stroke="' + a + '" stroke-opacity="0.35"/></svg>';
    return s;
  }

  function artNode(g) {
    if (g.image) {
      const img = document.createElement("img");
      img.src = g.image;
      img.alt = g.title;
      img.style.cssText = "width:100%;height:100%;object-fit:cover";
      img.addEventListener("error", function () { img.parentNode.innerHTML = artSVG(g); });
      return img;
    }
    const d = document.createElement("div");
    d.style.cssText = "width:100%;height:100%";
    d.innerHTML = artSVG(g);
    return d;
  }

  function show(g) {
    $("art").innerHTML = "";
    $("art").appendChild(artNode(g));
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
      const thumb = document.createElement("div");
      thumb.className = "thumb";
      thumb.appendChild(artNode(g));
      card.append(thumb, small, h3, p);
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

  show(games[0]);
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
