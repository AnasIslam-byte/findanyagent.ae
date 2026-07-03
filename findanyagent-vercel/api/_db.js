// Shared helper: connects to your Neon Postgres database (Vercel's current
// Postgres option, via the Marketplace integration). Uses the DATABASE_URL
// environment variable that Vercel injects automatically once you connect
// a Neon database to your project.
const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

function withCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function sendJson(res, status, data) {
  withCors(res);
  res.status(status).json(data);
}

module.exports = { sql, withCors, sendJson };
