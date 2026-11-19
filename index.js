const http = require("http");

const PORT = process.env.PORT || 8080;
const startTime = Date.now();

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>KENSHIN SCI-FI // サイファイ</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    body {
      background: radial-gradient(circle at top right, #082f49, #050a18 55%, #02040a);
      color: #f8fafc;
      min-height: 100vh;
    }
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 6%;
      border-bottom: 1px solid rgba(56, 189, 248, 0.15);
      backdrop-filter: blur(12px);
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .logo {
      font-size: 1.4rem;
      font-weight: 800;
      letter-spacing: 2px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .logo span { color: #00f0ff; }
    nav { display: flex; gap: 25px; align-items: center; }
    nav a {
      color: #94a3b8;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: color 0.2s;
    }
    nav a:hover, nav a.active { color: #00f0ff; }
    .hero {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 40px;
      align-items: center;
      padding: 60px 6%;
    }
    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(0, 240, 255, 0.08);
      border: 1px solid rgba(0, 240, 255, 0.35);
      color: #38bdf8;
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 1px;
      margin-bottom: 16px;
    }
    .dot { width: 8px; height: 8px; background: #00f0ff; border-radius: 50%; box-shadow: 0 0 8px #00f0ff; }
    .deploy-badge {
      display: inline-block;
      border: 1px solid rgba(99, 102, 241, 0.5);
      background: rgba(99, 102, 241, 0.12);
      color: #a5b4fc;
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 1px;
      margin-bottom: 22px;
    }
    h1 {
      font-size: 3.4rem;
      line-height: 1.1;
      font-weight: 900;
      margin-bottom: 18px;
    }
    h1 span {
      background: linear-gradient(90deg, #00f0ff, #6366f1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle {
      color: #94a3b8;
      font-size: 1.05rem;
      line-height: 1.6;
      margin-bottom: 28px;
      max-width: 520px;
    }
    .btn-group { display: flex; gap: 14px; }
    .btn-primary {
      background: linear-gradient(90deg, #0284c7, #4f46e5);
      border: none;
      color: white;
      padding: 13px 26px;
      border-radius: 10px;
      font-weight: 700;
      cursor: pointer;
      font-size: 0.95rem;
      box-shadow: 0 0 20px rgba(0, 240, 255, 0.25);
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(56, 189, 248, 0.3);
      color: #e0f2fe;
      padding: 13px 26px;
      border-radius: 10px;
      font-weight: 700;
      cursor: pointer;
      font-size: 0.95rem;
    }
    .featured-card {
      position: relative;
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid rgba(0, 240, 255, 0.25);
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.7);
      background: #0b1120;
    }
    .featured-banner {
      height: 320px;
      background: linear-gradient(135deg, #0c4a6e, #312e81, #090d16);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 28px;
      position: relative;
    }
    .trending-tag {
      position: absolute;
      top: 18px;
      left: 18px;
      background: #00f0ff;
      color: #020617;
      font-weight: 800;
      font-size: 0.72rem;
      padding: 5px 12px;
      border-radius: 999px;
      letter-spacing: 0.5px;
    }
    .grid-section { padding: 20px 6% 70px; }
    .section-title { font-size: 1.5rem; margin-bottom: 22px; font-weight: 800; }
    .scifi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
      gap: 22px;
    }
    .card {
      background: #0b1221;
      border: 1px solid rgba(56, 189, 248, 0.14);
      border-radius: 14px;
      padding: 18px;
      transition: transform 0.2s, border-color 0.2s;
    }
    .card:hover { transform: translateY(-5px); border-color: #00f0ff; }
    .card-thumb {
      height: 140px;
      border-radius: 10px;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.15rem;
      letter-spacing: 1.5px;
      text-align: center;
      padding: 10px;
    }
    .tag { font-size: 0.75rem; color: #38bdf8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; }
    .card h3 { margin: 6px 0 12px; font-size: 1.1rem; }
    .watch-btn {
      width: 100%;
      padding: 9px;
      border-radius: 8px;
      border: 1px solid #0284c7;
      background: transparent;
      color: #38bdf8;
      font-weight: 700;
      cursor: pointer;
    }
    .watch-btn:hover { background: #0284c7; color: white; }
    @media (max-width: 850px) {
      .hero { grid-template-columns: 1fr; }
      h1 { font-size: 2.5rem; }
    }
  </style>
</head>
<body>
  <header>
    <div class="logo">🛸 KENSHIN SCI-FI <span>// NEXUS</span></div>
    <nav>
      <a class="active" onclick="filterGenre('All')">All Sectors</a>
      <a onclick="filterGenre('Cyberpunk')">Cyberpunk</a>
      <a onclick="filterGenre('Space Opera')">Space Opera</a>
      <a id="watchlist-link">My Queue (0)</a>
    </nav>
  </header>

  <section class="hero">
    <div>
      <div class="status-pill"><span class="dot"></span> ORBITAL NODE + RAILWAY • UPTIME <span id="uptime">00:00:00</span></div>
      <br />
      <div class="deploy-badge">SYSTEM ONLINE • DEPLOYED BY KENSHIN</div>
      <h1>Explore Infinite <span>Sci-Fi Universes</span></h1>
      <p class="subtitle">Quantum-speed sci-fi archive streaming live on Railway. Browse Cyberpunk, Mecha, and Deep Space classics or queue your next mission.</p>
      <div class="btn-group">
        <button class="btn-primary" onclick="document.getElementById('catalog').scrollIntoView({behavior:'smooth'})">Launch Catalog</button>
        <button class="btn-secondary" onclick="addToWatchlist('Cyberpunk: Edgerunners')">+ Queue Featured</button>
      </div>
    </div>

    <div class="featured-card">
      <div class="featured-banner">
        <div class="trending-tag">★ #1 TOP RATED IN SECTOR 7</div>
        <span class="tag">CYBERPUNK • 4K ULTRA HD</span>
        <h2 style="font-size: 1.8rem; margin-top: 6px;">Cyberpunk: Edgerunners</h2>
        <p style="color: #cbd5e1; font-size: 0.9rem; margin-top: 6px;">High-tech street mercenaries battling megacorporations in Night City.</p>
      </div>
    </div>
  </section>

  <section class="grid-section" id="catalog">
    <h2 class="section-title" id="catalog-heading">Featured Sci-Fi Series</h2>
    <div class="scifi-grid" id="scifi-grid"></div>
  </section>

  <script>
    const scifiList = [
      { title: "Steins;Gate", genre: "Cyberpunk", color: "linear-gradient(135deg, #0f766e, #1e3a8a)" },
      { title: "Cowboy Bebop", genre: "Space Opera", color: "linear-gradient(135deg, #312e81, #4338ca)" },
      { title: "Psycho-Pass", genre: "Cyberpunk", color: "linear-gradient(135deg, #0369a1, #0f172a)" },
      { title: "Dune: Prophecy", genre: "Space Opera", color: "linear-gradient(135deg, #92400e, #1e293b)" },
      { title: "Ghost in the Shell", genre: "Cyberpunk", color: "linear-gradient(135deg, #065f46, #115e59)" },
      { title: "The Expanse", genre: "Space Opera", color: "linear-gradient(135deg, #1d4ed8, #090d16)" }
    ];

    let queue = [];

    function renderCards(filter) {
      const grid = document.getElementById("scifi-grid");
      const items = filter === "All" ? scifiList : scifiList.filter(s => s.genre === filter);
      document.getElementById("catalog-heading").innerText = filter === "All" ? "Featured Sci-Fi Series" : filter + " Archives";
      grid.innerHTML = items.map(item => \`
        <div class="card">
          <div class="card-thumb" style="background: \${item.color};">\${item.title.toUpperCase()}</div>
          <div class="tag">\${item.genre}</div>
          <h3>\${item.title}</h3>
          <button class="watch-btn" onclick="addToWatchlist('\${item.title}')">+ Add to Queue</button>
        </div>
      \`).join("");
    }

    function filterGenre(genre) {
      renderCards(genre);
    }

    function addToWatchlist(title) {
      if (!queue.includes(title)) {
        queue.push(title);
        document.getElementById("watchlist-link").innerText = "My Queue (" + queue.length + ")";
      }
    }

    const serverStart = ${startTime};
    setInterval(() => {
      const diff = Math.floor((Date.now() - serverStart) / 1000);
      const hrs = String(Math.floor(diff / 3600)).padStart(2, "0");
      const mins = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
      const secs = String(diff % 60).padStart(2, "0");
      document.getElementById("uptime").innerText = hrs + ":" + mins + ":" + secs;
    }, 1000);

    renderCards("All");
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(html);
});

server.listen(PORT, () => {
  console.log(\`Kenshin Sci-Fi server running on port \${PORT}\`);
});
