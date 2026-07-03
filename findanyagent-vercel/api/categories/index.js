const { sql, sendJson, withCors } = require("../_db");

module.exports = async function handler(req, res) {
  withCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return sendJson(res, 405, { error: "Method not allowed" });

  try {
    const rows = await sql`
      SELECT c.*, COUNT(a.id)::int AS agent_count
      FROM categories c
      LEFT JOIN agents a ON a.category_id = c.id
      GROUP BY c.id
      ORDER BY c.name;
    `;
    sendJson(res, 200, rows);
  } catch (err) {
    sendJson(res, 500, { error: err.message });
  }
};
