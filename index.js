const http = require("http");

const PORT = process.env.PORT || 8080;
const startTime = Date.now();

// "image" is optional: paste a poster URL (https://...) and it will be used.
// If it is empty or fails to load, the built-in artwork is shown instead.
const movies = [
  { id: 1, title: "Blade Runner 2049", genre: "Cyberpunk", year: 2017, description: "A blade runner uncovers a secret that could reshape society.", image: "", art: "skyline", c1: "#164e63", c2: "#312e81", accent: "#22d3ee" },
  { id: 2, title: "The Matrix", genre: "Cyberpunk", year: 1999, description: "A hacker discovers the truth behind reality.", image: "", art: "matrix", c1: "#064e3b", c2: "#020617", accent: "#4ade80" },
  { id: 3, title: "Ghost in the Shell", genre: "Cyberpunk", year: 1995, description: "A cybernetic agent investigates a digital criminal.", image: "", art: "skyline", c1: "#1e3a8a", c2: "#581c87", accent: "#f0abfc" },
  { id: 4, title: "Dune: Part Two", genre: "Space Opera", year: 2024, description: "A young leader unites with the Fremen on a desert world.", image: "", art: "desert", c1: "#92400e", c2: "#111827", accent: "#fbbf24" },
  { id: 5, title: "Interstellar", genre: "Space Opera", year: 2014, description: "Explorers travel beyond the solar system.", image: "", art: "wormhole", c1: "#1e40af", c2: "#020617", accent: "#7dd3fc" },
  { id: 6, title: "The Fifth Element", genre: "Space Opera", year: 1997, description: "A team races to protect the universe.", image: "", art: "planet", c1: "#9a3412", c2: "#4c1d95", accent: "#fb923c" },
  { id: 7, title: "Ready Player One", genre: "Cyberpunk", year: 2018, description: "A gamer enters a vast virtual world.", image: "", art: "skyline", c1: "#075985", c2: "#6b21a8", accent: "#e879f9" },
  { id: 8, title: "Guardians of the Galaxy", genre: "Space Opera", year: 2014, description: "A group of heroes protects the galaxy.", image: "", art: "planet", c1: "#9f1239", c2: "#1d4ed8", accent: "#f472b6" }
];

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#050a18">
<title>KENSHIN SCI-FI // NEXUS</title>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;800;900&family=Rajdhani:wght@500;600;700&display=swap" rel="stylesheet">

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: radial-gradient(circle at top right, #082f49, #050a18 55%, #02040a);
  color: #f8fafc;
  min-height: 100vh;
  font-family: 'Rajdhani', sans-serif;
}

button, input {
  font: inherit;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 20px 6%;
  border-bottom: 1px solid rgba(56,189,248,.15);
  background: rgba(2,6,23,.78);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 10;
}

.logo {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.15rem;
  font-weight: 900;
  letter-spacing: 2px;
}

.logo span {
  color: #00f0ff;
}

nav {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

nav a {
  color: #94a3b8;
  text-decoration: none;
  font-weight: 700;
  cursor: pointer;
  text-transform: uppercase;
}

nav a:hover,
nav a.active {
  color: #00f0ff;
}

.hero {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 40px;
  align-items: center;
  padding: 65px 6% 55px;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(0,240,255,.08);
  border: 1px solid rgba(0,240,255,.35);
  color: #38bdf8;
  padding: 6px 14px;
  border-radius: 999px;
  font-weight: 700;
  margin-bottom: 16px;
}

.dot {
  width: 8px;
  height: 8px;
  background: #00f0ff;
  border-radius: 50%;
  box-shadow: 0 0 8px #00f0ff;
}

.deploy-badge {
  display: inline-block;
  border: 1px solid rgba(99,102,241,.5);
  background: rgba(99,102,241,.12);
  color: #a5b4fc;
  padding: 6px 14px;
  border-radius: 8px;
  margin-bottom: 22px;
  font-weight: 700;
}

h1 {
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(2.2rem,4.2vw,3.5rem);
  line-height: 1.15;
  margin-bottom: 18px;
}

h1 span {
  background: linear-gradient(90deg,#00f0ff,#6366f1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: #94a3b8;
  font-size: 1.15rem;
  line-height: 1.6;
  margin-bottom: 28px;
  max-width: 540px;
}

.btn-group {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  padding: 13px 22px;
  border-radius: 10px;
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
  cursor: pointer;
}

.btn-primary {
  background: linear-gradient(90deg,#0284c7,#4f46e5);
  border: none;
  color: white;
}

.btn-secondary {
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(56,189,248,.3);
  color: #e0f2fe;
}

button:hover {
  filter: brightness(1.2);
}

.featured-card {
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(0,240,255,.25);
  box-shadow: 0 25px 50px rgba(0,0,0,.55);
}

.featured-banner {
  min-height: 320px;
  background: linear-gradient(135deg,#0c4a6e,#312e81,#090d16);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 28px;
  position: relative;
  overflow: hidden;
}

.featured-art {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.featured-art svg,
.featured-art img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.featured-banner::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(to top, rgba(2,6,23,.92) 5%, rgba(2,6,23,.35) 60%, rgba(2,6,23,.1));
}

.featured-banner h2,
.featured-banner p,
.featured-banner .tag,
.featured-banner .featured-actions {
  position: relative;
  z-index: 2;
}

.featured-banner h2 {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.6rem;
  margin: 8px 0;
}

.featured-banner p {
  color: #cbd5e1;
}

.trending-tag,
.play-badge {
  position: absolute;
  z-index: 2;
  top: 18px;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: .8rem;
  font-weight: 700;
}

.trending-tag {
  left: 18px;
  background: #00f0ff;
  color: #020617;
}

.play-badge {
  right: 18px;
  border: 1px solid #00f0ff;
  color: #00f0ff;
  background: rgba(2,6,23,.75);
}

.grid-section {
  padding: 20px 6% 70px;
}

.catalog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 22px;
}

.section-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.35rem;
}

.search-box {
  background: #0b1221;
  border: 1px solid rgba(56,189,248,.35);
  color: white;
  padding: 10px 16px;
  border-radius: 10px;
  width: min(100%,280px);
  outline: none;
}

.search-box:focus {
  border-color: #00f0ff;
}

.scifi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(230px,1fr));
  gap: 22px;
}

.card {
  background: #0b1221;
  border: 1px solid rgba(56,189,248,.14);
  border-radius: 14px;
  padding: 18px;
  transition: .2s;
}

.card:hover {
  transform: translateY(-5px);
  border-color: #00f0ff;
}

.card-thumb {
  position: relative;
  overflow: hidden;
  aspect-ratio: 2 / 3;
  border-radius: 10px;
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgba(255,255,255,.12);
  font-family: 'Orbitron', sans-serif;
  font-weight: 800;
  text-align: center;
  background: #0b1221;
}

.card-thumb svg,
.card-thumb img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card-thumb::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(2,6,23,.85), rgba(2,6,23,0) 60%);
}

.thumb-genre {
  position: relative;
  z-index: 2;
  width: 100%;
  padding: 12px 10px 0;
  font-size: .65rem;
  letter-spacing: 3px;
  color: #e0f2fe;
  opacity: .85;
  text-shadow: 0 2px 6px rgba(0,0,0,.9);
}

.thumb-title {
  position: relative;
  z-index: 2;
  width: 100%;
  padding: 0 12px 16px;
  font-size: 1.25rem;
  line-height: 1.15;
  letter-spacing: 2px;
  text-shadow: 0 3px 12px rgba(0,0,0,.95);
}

.thumb-title::before {
  content: "";
  display: block;
  width: 40px;
  height: 2px;
  margin: 0 auto 10px;
  background: #00f0ff;
  box-shadow: 0 0 8px #00f0ff;
}

.tag {
  color: #38bdf8;
  font-weight: 700;
  text-transform: uppercase;
}

.card h3 {
  margin: 6px 0;
  font-size: 1.25rem;
}

.year {
  color: #64748b;
  margin-bottom: 9px;
}

.card p {
  color: #94a3b8;
  margin-bottom: 14px;
  min-height: 40px;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.watch-btn,
.queue-btn {
  padding: 9px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
}

.watch-btn {
  flex: 1;
  border: 1px solid #0284c7;
  background: transparent;
  color: #38bdf8;
}

.watch-btn:hover {
  background: #0284c7;
  color: white;
}

.queue-btn {
  border: 1px solid rgba(0,240,255,.3);
  background: rgba(0,240,255,.12);
  color: #00f0ff;
}

.empty {
  color: #94a3b8;
  padding: 28px;
  text-align: center;
  border: 1px dashed rgba(56,189,248,.3);
  border-radius: 12px;
  grid-column: 1/-1;
}

.modal-backdrop {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(2,6,23,.88);
  backdrop-filter: blur(8px);
  z-index: 50;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-backdrop.open {
  display: flex;
}

.modal-box {
  background: #0b1221;
  border: 1px solid #00f0ff;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  padding: 24px;
  max-height: 85vh;
  overflow: auto;
}

.modal-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 15px;
}

.modal-title {
  font-family: 'Orbitron', sans-serif;
  color: #00f0ff;
  font-size: 1.15rem;
}

.close-btn {
  background: transparent;
  border: 1px solid #334155;
  color: white;
  border-radius: 8px;
  padding: 5px 10px;
  cursor: pointer;
}

.modal-box p {
  color: #94a3b8;
  margin: 12px 0 18px;
}

.queue-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(56,189,248,.15);
}

.queue-item small {
  color: #64748b;
  display: block;
}

.remove-btn {
  background: transparent;
  border: 1px solid #7f1d1d;
  color: #fca5a5;
  padding: 6px 10px;
  border-radius: 7px;
  cursor: pointer;
}

footer {
  border-top: 1px solid rgba(56,189,248,.15);
  padding: 22px 6%;
  color: #64748b;
  text-align: center;
}

@media(max-width:850px) {
  header {
    align-items: flex-start;
    flex-direction: column;
  }

  .hero {
    grid-template-columns: 1fr;
  }
}

@media(max-width:480px) {
  nav {
    gap: 12px;
  }

  nav a {
    font-size: .85rem;
  }

  .featured-banner {
    min-height: 260px;
  }

  .search-box {
    width: 100%;
  }
}
</style>
</head>

<body>

<header>
  <div class="logo">🛸 KENSHIN SCI-FI <span>// NEXUS</span></div>

  <nav>
    <a href="#" class="active" data-genre="All">All Sectors</a>
    <a href="#" data-genre="Cyberpunk">Cyberpunk</a>
    <a href="#" data-genre="Space Opera">Space Opera</a>
    <a href="#" id="watchlist-link">My Queue (0)</a>
  </nav>
</header>

<section class="hero">
  <div>
    <div class="status-pill">
      <span class="dot"></span>
      ORBITAL NODE + RAILWAY • UPTIME
      <span id="uptime">00:00:00</span>
    </div>

    <br>

    <div class="deploy-badge">
      SYSTEM ONLINE • DEPLOYED BY KENSHIN
    </div>

    <h1>Explore Infinite <span>Sci-Fi Universes</span></h1>

    <p class="subtitle">
      Your personal sci-fi archive. Discover cyberpunk worlds,
      interstellar adventures, official trailers, and build
      your own mission queue.
    </p>

    <div class="btn-group">
      <button class="btn-primary" id="explore-btn">
        EXPLORE ARCHIVE
      </button>

      <button class="btn-secondary" id="queue-btn">
        OPEN MY QUEUE
      </button>
    </div>
  </div>

  <div class="featured-card">
    <div class="featured-banner">
      <div class="featured-art" id="featured-art"></div>
      <span class="trending-tag">FEATURED TRANSMISSION</span>
      <span class="play-badge">▶ FEATURED</span>
      <span class="tag">SPACE OPERA • 2024</span>

      <h2>DUNE: PART TWO</h2>

      <p>
        Journey to Arrakis and explore a universe
        shaped by power, prophecy, and survival.
      </p>

      <div class="featured-actions" style="margin-top:18px">
        <button class="btn-primary" id="featured-btn">
          VIEW DETAILS ↗
        </button>
      </div>
    </div>
  </div>
</section>

<main class="grid-section" id="archive">
  <div class="catalog-header">
    <h2 class="section-title">◈ ARCHIVE DATABASE</h2>

    <input
      class="search-box"
      id="search"
      type="search"
      placeholder="Search titles..."
      aria-label="Search titles"
    >
  </div>

  <div class="scifi-grid" id="movie-grid"></div>
</main>

<div class="modal-backdrop" id="details-modal">
  <div class="modal-box">
    <div class="modal-top">
      <h2 class="modal-title" id="details-title">
        TRANSMISSION DETAILS
      </h2>
      <button class="close-btn" data-close="details-modal">✕</button>
    </div>

    <div id="details-content"></div>
  </div>
</div>

<div class="modal-backdrop" id="queue-modal">
  <div class="modal-box">
    <div class="modal-top">
      <h2 class="modal-title">MY MISSION QUEUE</h2>
      <button class="close-btn" data-close="queue-modal">✕</button>
    </div>

    <div id="queue-content"></div>
  </div>
</div>

<footer>
  KENSHIN SCI-FI // NEXUS • Personal sci-fi archive •
  <span id="server-status">Checking server...</span>
</footer>

<script>
const movies = ${JSON.stringify(movies)};

let activeGenre = "All";

let queue = [];

try {
  queue = JSON.parse(
    localStorage.getItem("kenshinQueue") || "[]"
  );

  if (!Array.isArray(queue)) queue = [];
} catch {
  queue = [];
}

const grid = document.getElementById("movie-grid");
const searchInput = document.getElementById("search");

// ---------- ARTWORK ----------

let artUid = 0;

function rng(seed) {
  let s = seed * 9301 + 49297;
  return function () {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function artSVG(m) {
  const R = rng(m.id * 7 + 3);
  const uid = "a" + m.id + "_" + (artUid++);
  const acc = m.accent;
  let s = '<svg viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">';

  s += '<defs>' +
    '<linearGradient id="bg' + uid + '" x1="0" y1="0" x2="0.5" y2="1">' +
    '<stop offset="0" stop-color="' + m.c1 + '"/>' +
    '<stop offset="1" stop-color="' + m.c2 + '"/></linearGradient>' +
    '<radialGradient id="gl' + uid + '">' +
    '<stop offset="0" stop-color="' + acc + '" stop-opacity="0.95"/>' +
    '<stop offset="1" stop-color="' + acc + '" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="pl' + uid + '" cx="0.35" cy="0.3" r="0.8">' +
    '<stop offset="0" stop-color="' + acc + '"/>' +
    '<stop offset="1" stop-color="' + m.c1 + '"/></radialGradient>' +
    '</defs>';

  s += '<rect width="200" height="300" fill="url(#bg' + uid + ')"/>';

  for (let i = 0; i < 60; i++) {
    s += '<circle cx="' + (R() * 200).toFixed(1) + '" cy="' + (R() * 200).toFixed(1) +
      '" r="' + (R() * 1.1 + 0.3).toFixed(2) + '" fill="#fff" opacity="' + (0.25 + R() * 0.6).toFixed(2) + '"/>';
  }

  if (m.art === "skyline") {
    s += '<circle cx="135" cy="100" r="64" fill="url(#gl' + uid + ')" opacity="0.7"/>';
    s += '<circle cx="135" cy="100" r="26" fill="' + acc + '" opacity="0.9"/>';

    [0.45, 1].forEach(function (layer) {
      for (let x = -5; x < 200; ) {
        const w = 12 + R() * 20;
        const h = (layer === 1 ? 90 : 70) + R() * (layer === 1 ? 120 : 90);
        s += '<rect x="' + x.toFixed(1) + '" y="' + (300 - h).toFixed(1) + '" width="' + w.toFixed(1) +
          '" height="' + h.toFixed(1) + '" fill="#050a18" opacity="' + layer + '"/>';

        if (layer === 1) {
          for (let k = 0; k < 9; k++) {
            if (R() > 0.45) {
              s += '<rect x="' + (x + 3 + R() * (w - 8)).toFixed(1) + '" y="' + (300 - h + 6 + R() * (h - 14)).toFixed(1) +
                '" width="2" height="2.5" fill="' + acc + '" opacity="' + (0.5 + R() * 0.5).toFixed(2) + '"/>';
            }
          }
        }
        x += w + 1 + R() * 3;
      }
    });
  }

  if (m.art === "matrix") {
    for (let x = 3; x < 200; x += 8) {
      const len = 40 + R() * 180;
      const y0 = R() * 80 - 40;
      s += '<rect x="' + x + '" y="' + y0.toFixed(1) + '" width="3" height="' + len.toFixed(1) +
        '" fill="' + acc + '" opacity="' + (0.15 + R() * 0.45).toFixed(2) + '"/>';
      s += '<rect x="' + x + '" y="' + (y0 + len).toFixed(1) + '" width="3" height="5" fill="#d1fae5" opacity="0.95"/>';
    }
    s += '<circle cx="100" cy="140" r="80" fill="url(#gl' + uid + ')" opacity="0.25"/>';
  }

  if (m.art === "desert") {
    s += '<circle cx="100" cy="130" r="76" fill="url(#gl' + uid + ')" opacity="0.7"/>';
    s += '<circle cx="100" cy="130" r="36" fill="' + acc + '"/>';
    s += '<path d="M0 195 Q60 150 120 190 T200 175 V300 H0Z" fill="#78350f" opacity="0.8"/>';
    s += '<path d="M0 230 Q70 190 130 225 T200 215 V300 H0Z" fill="#451a03" opacity="0.92"/>';
    s += '<path d="M0 268 Q60 245 120 265 T200 258 V300 H0Z" fill="#1c0a02"/>';
  }

  if (m.art === "wormhole") {
    for (let i = 9; i >= 0; i--) {
      s += '<ellipse cx="100" cy="140" rx="' + (8 + i * 11) + '" ry="' + (14 + i * 15) +
        '" fill="none" stroke="' + acc + '" stroke-width="1.6" opacity="' + (0.9 - i * 0.08).toFixed(2) + '"/>';
    }
    s += '<circle cx="100" cy="140" r="30" fill="url(#gl' + uid + ')"/>';
    s += '<circle cx="100" cy="140" r="7" fill="#fff"/>';
    s += '<polygon points="150,230 168,235 150,240" fill="#e2e8f0"/>';
  }

  if (m.art === "planet") {
    s += '<circle cx="100" cy="150" r="66" fill="url(#pl' + uid + ')"/>';
    s += '<circle cx="100" cy="150" r="66" fill="none" stroke="#fff" stroke-opacity="0.12"/>';
    s += '<ellipse cx="100" cy="150" rx="112" ry="20" fill="none" stroke="' + acc + '" stroke-width="3.5" opacity="0.75" transform="rotate(-18 100 150)"/>';
    s += '<circle cx="165" cy="58" r="12" fill="' + acc + '" opacity="0.8"/>';
    s += '<circle cx="34" cy="238" r="6" fill="#e2e8f0" opacity="0.7"/>';
  }

  s += '<rect x="6" y="6" width="188" height="288" fill="none" stroke="' + acc + '" stroke-opacity="0.35"/>';
  s += '</svg>';
  return s;
}

// Builds a poster-style thumbnail: real poster if movie.image is set, else artwork.
function makeThumb(movie) {
  const thumb = document.createElement("div");
  thumb.className = "card-thumb";

  const showArt = function () {
    thumb.insertAdjacentHTML("afterbegin", artSVG(movie));
  };

  if (movie.image) {
    const img = document.createElement("img");
    img.alt = movie.title;
    img.loading = "lazy";
    img.referrerPolicy = "no-referrer";
    img.addEventListener("error", function () {
      img.remove();
      showArt();
    });
    img.src = movie.image;
    thumb.appendChild(img);
  } else {
    showArt();
  }

  const top = document.createElement("span");
  top.className = "thumb-genre";
  top.textContent = movie.genre.toUpperCase() + " • " + movie.year;

  const label = document.createElement("span");
  label.className = "thumb-title";
  label.textContent = movie.title.toUpperCase();

  thumb.append(top, label);

  return thumb;
}

// ---------- QUEUE / RENDER ----------

function saveQueue() {
  localStorage.setItem(
    "kenshinQueue",
    JSON.stringify(queue)
  );

  updateQueueCount();
}

function updateQueueCount() {
  document.getElementById("watchlist-link").textContent =
    "My Queue (" + queue.length + ")";
}

function renderMovies() {
  const term = searchInput.value.trim().toLowerCase();

  const filtered = movies.filter(movie =>
    (activeGenre === "All" || movie.genre === activeGenre) &&
    (
      movie.title.toLowerCase().includes(term) ||
      movie.description.toLowerCase().includes(term)
    )
  );

  grid.innerHTML = "";

  if (!filtered.length) {
    grid.innerHTML =
      '<div class="empty">No transmissions found. Try another title or sector.</div>';
    return;
  }

  filtered.forEach(movie => {
    const inQueue = queue.includes(movie.id);

    const card = document.createElement("article");
    card.className = "card";

    const thumb = makeThumb(movie);

    const genre = document.createElement("div");
    genre.className = "tag";
    genre.textContent = movie.genre;

    const title = document.createElement("h3");
    title.textContent = movie.title;

    const year = document.createElement("div");
    year.className = "year";
    year.textContent = movie.year;

    const description = document.createElement("p");
    description.textContent = movie.description;

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const detailsButton = document.createElement("button");
    detailsButton.className = "watch-btn";
    detailsButton.textContent = "VIEW DETAILS";
    detailsButton.dataset.action = "details";
    detailsButton.dataset.id = movie.id;

    const queueButton = document.createElement("button");
    queueButton.className = "queue-btn";
    queueButton.textContent = inQueue ? "✓ ADDED" : "+ QUEUE";
    queueButton.dataset.action = "queue";
    queueButton.dataset.id = movie.id;

    actions.append(detailsButton, queueButton);

    card.append(
      thumb,
      genre,
      title,
      year,
      description,
      actions
    );

    grid.appendChild(card);
  });
}

function openModal(id) {
  document.getElementById(id).classList.add("open");
}

function closeModal(id) {
  document.getElementById(id).classList.remove("open");
}

function showDetails(id) {
  const movie = movies.find(
    item => item.id === Number(id)
  );

  if (!movie) return;

  document.getElementById("details-title").textContent =
    movie.title.toUpperCase();

  const youtubeSearch =
    "https://www.youtube.com/results?search_query=" +
    encodeURIComponent(movie.title + " official trailer");

  const content = document.getElementById("details-content");

  content.innerHTML = "";

  const thumb = makeThumb(movie);
  thumb.style.maxWidth = "260px";
  thumb.style.margin = "0 auto";

  const genre = document.createElement("div");
  genre.className = "tag";
  genre.style.marginTop = "14px";
  genre.textContent = movie.genre + " • " + movie.year;

  const description = document.createElement("p");
  description.textContent = movie.description;

  const actions = document.createElement("div");
  actions.className = "btn-group";

  const trailer = document.createElement("a");
  trailer.className = "btn-primary";
  trailer.style.textDecoration = "none";
  trailer.style.display = "inline-block";
  trailer.href = youtubeSearch;
  trailer.target = "_blank";
  trailer.rel = "noopener noreferrer";
  trailer.textContent = "FIND OFFICIAL TRAILER ↗";

  const queueButton = document.createElement("button");
  queueButton.className = "btn-secondary";
  queueButton.textContent = queue.includes(movie.id)
    ? "REMOVE FROM QUEUE"
    : "ADD TO QUEUE";

  queueButton.addEventListener("click", () => {
    toggleQueue(movie.id);
    showDetails(movie.id);
  });

  actions.append(trailer, queueButton);

  content.append(thumb, genre, description, actions);

  openModal("details-modal");
}

function toggleQueue(id) {
  id = Number(id);

  queue = queue.includes(id)
    ? queue.filter(item => item !== id)
    : [...queue, id];

  saveQueue();
  renderMovies();
}

function showQueue() {
  const content = document.getElementById("queue-content");

  const selected = movies.filter(movie =>
    queue.includes(movie.id)
  );

  content.innerHTML = "";

  if (!selected.length) {
    content.innerHTML =
      '<div class="empty">Your mission queue is empty. Add a title from the archive.</div>';
  } else {
    selected.forEach(movie => {
      const item = document.createElement("div");
      item.className = "queue-item";

      const info = document.createElement("div");

      const title = document.createElement("strong");
      title.textContent = movie.title;

      const small = document.createElement("small");
      small.textContent = movie.genre + " • " + movie.year;

      info.append(title, small);

      const remove = document.createElement("button");
      remove.className = "remove-btn";
      remove.textContent = "REMOVE";

      remove.addEventListener("click", () => {
        toggleQueue(movie.id);
        showQueue();
      });

      item.append(info, remove);
      content.appendChild(item);
    });
  }

  openModal("queue-modal");
}

// GENRE FILTERING

document.querySelectorAll("nav a[data-genre]").forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();

    activeGenre = link.dataset.genre;

    document.querySelectorAll("nav a[data-genre]")
      .forEach(item => {
        item.classList.toggle("active", item === link);
      });

    renderMovies();

    document.getElementById("archive").scrollIntoView({
      behavior: "smooth"
    });
  });
});

// MOVIE CARD BUTTONS

grid.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");

  if (!button) return;

  const id = Number(button.dataset.id);

  if (button.dataset.action === "details") {
    showDetails(id);
  }

  if (button.dataset.action === "queue") {
    toggleQueue(id);
  }
});

// SEARCH

searchInput.addEventListener("input", renderMovies);

// NAVIGATION

document.getElementById("watchlist-link")
  .addEventListener("click", event => {
    event.preventDefault();
    showQueue();
  });

document.getElementById("queue-btn")
  .addEventListener("click", showQueue);

document.getElementById("explore-btn")
  .addEventListener("click", () => {
    document.getElementById("archive").scrollIntoView({
      behavior: "smooth"
    });
  });

document.getElementById("featured-btn")
  .addEventListener("click", () => showDetails(4));

// CLOSE MODALS

document.querySelectorAll("[data-close]").forEach(button => {
  button.addEventListener("click", () => {
    closeModal(button.dataset.close);
  });
});

document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
  backdrop.addEventListener("click", event => {
    if (event.target === backdrop) {
      closeModal(backdrop.id);
    }
  });
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    document.querySelectorAll(".modal-backdrop.open")
      .forEach(modal => closeModal(modal.id));
  }
});

// UPTIME COUNTER

function formatUptime(ms) {
  const total = Math.floor(ms / 1000);

  const hours = String(
    Math.floor(total / 3600)
  ).padStart(2, "0");

  const minutes = String(
    Math.floor((total % 3600) / 60)
  ).padStart(2, "0");

  const seconds = String(
    total % 60
  ).padStart(2, "0");

  return hours + ":" + minutes + ":" + seconds;
}

// SERVER HEALTH CHECK

async function checkServer() {
  try {
    const response = await fetch("/health");
    const data = await response.json();

    document.getElementById("server-status").textContent =
      data.status === "ok"
        ? "SERVER ONLINE"
        : "SERVER ISSUE";

  } catch {
    document.getElementById("server-status").textContent =
      "SERVER STATUS UNKNOWN";
  }
}

// INITIALIZATION

(function initFeatured() {
  const featured = movies.find(m => m.id === 4);
  const box = document.getElementById("featured-art");
  if (!featured || !box) return;

  if (featured.image) {
    const img = document.createElement("img");
    img.alt = featured.title;
    img.referrerPolicy = "no-referrer";
    img.addEventListener("error", function () {
      img.remove();
      box.innerHTML = artSVG(featured);
    });
    img.src = featured.image;
    box.appendChild(img);
  } else {
    box.innerHTML = artSVG(featured);
  }
})();

renderMovies();
updateQueueCount();
checkServer();

setInterval(() => {
  document.getElementById("uptime").textContent =
    formatUptime(Date.now() - ${startTime});
}, 1000);

</script>
</body>
</html>`;

const server = http.createServer((req, res) => {

  if (req.url === "/health") {
    res.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8"
    });

    return res.end(JSON.stringify({
      status: "ok",
      service: "kenshin-sci-fi-nexus",
      uptimeSeconds: Math.floor(
        (Date.now() - startTime) / 1000
      )
    }));
  }

  if (req.url === "/" || req.url.startsWith("/?")) {
    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store"
    });

    return res.end(html);
  }


  res.writeHead(404, {
    "Content-Type": "text/plain; charset=utf-8"
  });

  res.end("404 - Page not found");
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(
    `KENSHIN SCI-FI NEXUS is running on port ${PORT}`
  );
});
