const { sql, sendJson, withCors } = require("../_db");

module.exports = async function handler(req, res) {
  withCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return sendJson(res, 405, { error: "Method not allowed" });

  try {
    const rows = await sql`SELECT DISTINCT city FROM agents ORDER BY city;`;
    sendJson(res, 200, rows.map((r) => r.city));
  } catch (err) {
    sendJson(res, 500, { error: err.message });
  }
};
