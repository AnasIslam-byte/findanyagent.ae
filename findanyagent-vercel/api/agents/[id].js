const { sql, sendJson, withCors } = require("../_db");

module.exports = async function handler(req, res) {
  withCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const rows = await sql`
        SELECT a.*, c.name AS category_name, c.slug AS category_slug
        FROM agents a JOIN categories c ON c.id = a.category_id
        WHERE a.id = ${id};
      `;
      if (rows.length === 0) return sendJson(res, 404, { error: "Agent not found" });
      sendJson(res, 200, rows[0]);
    } catch (err) {
      sendJson(res, 500, { error: err.message });
    }
    return;
  }

  if (req.method === "DELETE") {
    try {
      const rows = await sql`DELETE FROM agents WHERE id = ${id} RETURNING id;`;
      if (rows.length === 0) return sendJson(res, 404, { error: "Agent not found" });
      sendJson(res, 200, { success: true });
    } catch (err) {
      sendJson(res, 500, { error: err.message });
    }
    return;
  }

  sendJson(res, 405, { error: "Method not allowed" });
};
