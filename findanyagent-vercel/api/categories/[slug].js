const { sql, sendJson, withCors } = require("../_db");

module.exports = async function handler(req, res) {
  withCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return sendJson(res, 405, { error: "Method not allowed" });

  const { slug } = req.query;

  try {
    const rows = await sql`SELECT * FROM categories WHERE slug = ${slug};`;
    if (rows.length === 0) return sendJson(res, 404, { error: "Category not found" });
    sendJson(res, 200, rows[0]);
  } catch (err) {
    sendJson(res, 500, { error: err.message });
  }
};
