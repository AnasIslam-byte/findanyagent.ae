const { sql, sendJson, withCors } = require("../_db");

module.exports = async function handler(req, res) {
  withCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    const { search, category, city, verified } = req.query;

    try {
      let query = `
        SELECT a.*, c.name AS category_name, c.slug AS category_slug
        FROM agents a
        JOIN categories c ON c.id = a.category_id
        WHERE 1=1
      `;
      const params = [];

      if (search) {
        params.push(`%${search}%`);
        query += ` AND (a.name ILIKE $${params.length} OR a.description ILIKE $${params.length})`;
      }
      if (category) {
        params.push(category);
        query += ` AND c.slug = $${params.length}`;
      }
      if (city) {
        params.push(city);
        query += ` AND a.city = $${params.length}`;
      }
      if (verified === "1") {
        query += ` AND a.verified = 1`;
      }

      query += ` ORDER BY a.verified DESC, a.rating DESC;`;

      const rows = await sql.query(query, params);
      sendJson(res, 200, rows);
    } catch (err) {
      sendJson(res, 500, { error: err.message });
    }
    return;
  }

  if (req.method === "POST") {
    const { name, category_id, city, phone, email, whatsapp, description, image_url } = req.body;

    if (!name || !category_id || !city) {
      return sendJson(res, 400, { error: "name, category_id and city are required" });
    }

    try {
      const rows = await sql`
        INSERT INTO agents (name, category_id, city, phone, email, whatsapp, description, image_url, verified, rating, reviews_count)
        VALUES (${name}, ${category_id}, ${city}, ${phone || null}, ${email || null}, ${whatsapp || null}, ${description || null}, ${image_url || null}, 0, 4.5, 0)
        RETURNING *;
      `;
      sendJson(res, 201, rows[0]);
    } catch (err) {
      sendJson(res, 500, { error: err.message });
    }
    return;
  }

  sendJson(res, 405, { error: "Method not allowed" });
};
