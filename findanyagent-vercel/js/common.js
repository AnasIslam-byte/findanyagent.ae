// On Vercel, frontend and API are served from the same domain, so a
// relative path always works.
const API_BASE = "/api";

async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

async function apiPost(path, data) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Request failed");
  return json;
}

function renderHeader() {
  const el = document.getElementById("site-header");
  if (!el) return;
  el.innerHTML = `
    <div class="nav-wrap">
      <a class="logo" href="/index.html">
        <img src="/images/logo.svg" alt="FindAnyAgent logo" width="34" height="34" />
        Find<span>Any</span>Agent
      </a>
      <nav class="main-nav">
        <ul>
          <li><a href="/index.html">Home</a></li>
          <li><a href="/pages/agents.html">All Agents</a></li>
          <li><a href="/pages/agents.html?category=real-estate">Real Estate</a></li>
          <li><a href="/pages/contact.html">Contact</a></li>
        </ul>
      </nav>
    </div>
  `;
}

function renderFooter() {
  const el = document.getElementById("site-footer");
  if (!el) return;
  el.innerHTML = `
    <div class="container">
      <div>
        <h4>FindAnyAgent (Local Clone)</h4>
        <p>UAE's directory to discover verified agents &amp; agencies — Real Estate,<br>Legal, Trade Finance, Umrah &amp; more.</p>
      </div>
      <div>
        <h4>Quick Links</h4>
        <p><a href="/index.html">Home</a></p>
        <p><a href="/pages/agents.html">Browse Agents</a></p>
        <p><a href="/pages/contact.html">Contact Us</a></p>
      </div>
      <div>
        <h4>Contact</h4>
        <p>info@findanyagent.local</p>
        <p>Dubai, United Arab Emirates</p>
      </div>
    </div>
    <div class="footer-bottom">&copy; ${new Date().getFullYear()} FindAnyAgent Local Clone — built for demo/learning purposes.</div>
  `;
}

function starString(rating) {
  const full = Math.round(rating);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

function agentCardHTML(agent) {
  const img = agent.image_url || "https://via.placeholder.com/400x260?text=No+Image";
  const verifiedBadge = agent.verified
    ? `<span class="verified-badge">✔ Verified</span>`
    : "";
  return `
    <div class="agent-card">
      <img src="${img}" alt="${agent.name}" loading="lazy" />
      <div class="agent-card-body">
        <div class="cat-tag">${agent.category_name || ""}</div>
        <h3>${agent.name} ${verifiedBadge}</h3>
        <div class="city">📍 ${agent.city}</div>
        <div class="desc">${agent.description || ""}</div>
        <div class="rating-row">
          <span class="stars">${starString(agent.rating)}</span>
          <span>${agent.rating} (${agent.reviews_count} reviews)</span>
        </div>
        <a class="btn btn-primary" href="/pages/agent.html?id=${agent.id}">View Profile</a>
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
});
