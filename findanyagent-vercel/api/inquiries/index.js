const { sql, sendJson, withCors } = require("../_db");

module.exports = async function handler(req, res) {
  withCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "POST") {
    const { agent_id, name, email, phone, message } = req.body;

    if (!name || !email) {
      return sendJson(res, 400, { error: "name and email are required" });
    }

    try {
      const rows = await sql`
        INSERT INTO inquiries (agent_id, name, email, phone, message)
        VALUES (${agent_id || null}, ${name}, ${email}, ${phone || null}, ${message || null})
        RETURNING id;
      `;
      sendJson(res, 201, {
        success: true,
        id: rows[0].id,
        message: "Your inquiry has been received. We'll get back to you soon.",
      });
    } catch (err) {
      sendJson(res, 500, { error: err.message });
    }
    return;
  }

  if (req.method === "GET") {
    try {
      const rows = await sql`
        SELECT i.*, a.name AS agent_name
        FROM inquiries i
        LEFT JOIN agents a ON a.id = i.agent_id
        ORDER BY i.created_at DESC;
      `;
      sendJson(res, 200, rows);
    } catch (err) {
      sendJson(res, 500, { error: err.message });
    }
    return;
  }

  sendJson(res, 405, { error: "Method not allowed" });
};
