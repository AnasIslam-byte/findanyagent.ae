const { sql, sendJson, withCors } = require("./_db");

// Visit /api/setup once after deploying (and after linking a Neon Postgres
// database to your Vercel project) to create tables and seed sample data.
// It's safe to call more than once — it won't duplicate data.
module.exports = async function handler(req, res) {
  withCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        icon TEXT DEFAULT '🏢',
        description TEXT
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS agents (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        category_id INTEGER NOT NULL REFERENCES categories(id),
        city TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        whatsapp TEXT,
        description TEXT,
        image_url TEXT,
        verified INTEGER DEFAULT 0,
        rating REAL DEFAULT 4.5,
        reviews_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS inquiries (
        id SERIAL PRIMARY KEY,
        agent_id INTEGER REFERENCES agents(id),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        message TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    const existing = await sql`SELECT COUNT(*)::int AS c FROM categories;`;

    if (existing[0].c === 0) {
      const categories = [
        ["Real Estate Agents", "real-estate", "🏠", "Find verified property agents across UAE"],
        ["Legal Consultants", "legal", "⚖️", "Trusted legal advisors and law firms"],
        ["Trade Finance", "trade-finance", "💰", "Business & trade finance specialists"],
        ["Umrah & Hajj Agencies", "umrah-hajj", "🕋", "Verified Umrah and Hajj travel agencies"],
        ["Business Setup Consultants", "business-setup", "📋", "Company formation and licensing experts"],
        ["Insurance Agents", "insurance", "🛡️", "Health, life and property insurance advisors"],
      ];

      const catIds = {};
      for (const [name, slug, icon, description] of categories) {
        const rows = await sql`
          INSERT INTO categories (name, slug, icon, description)
          VALUES (${name}, ${slug}, ${icon}, ${description})
          RETURNING id;
        `;
        catIds[slug] = rows[0].id;
      }

      const agents = [
        { name: "Ahmed Al Farsi", category_id: catIds["real-estate"], city: "Dubai", phone: "+971-4-1234567", email: "ahmed.farsi@almanzil.ae", whatsapp: "+971501234567", description: "Senior agent at Al Manzil Real Estate — specialist in Downtown Dubai and Marina properties, with 12+ years of market experience.", image_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&h=500&fit=crop&crop=faces", verified: 1, rating: 4.8, reviews_count: 214 },
        { name: "Sara Khan", category_id: catIds["real-estate"], city: "Dubai", phone: "+971-4-2345678", email: "sara.khan@palmhomes.ae", whatsapp: "+971502345678", description: "Lead consultant at Palm Homes Realty — luxury villa and apartment sales on Palm Jumeirah and Emirates Hills.", image_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&h=500&fit=crop&crop=faces", verified: 1, rating: 4.6, reviews_count: 156 },
        { name: "Khalid Mansoor", category_id: catIds["real-estate"], city: "Abu Dhabi", phone: "+971-2-3456789", email: "khalid.mansoor@capitalestates.ae", whatsapp: "+971503456789", description: "Broker at Capital Estates Abu Dhabi — full-service residential and commercial real estate in the capital.", image_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&h=500&fit=crop&crop=faces", verified: 0, rating: 4.3, reviews_count: 88 },
        { name: "Fatima Al Zaabi", category_id: catIds["legal"], city: "Dubai", phone: "+971-4-4567890", email: "fatima.zaabi@emirateslegal.ae", whatsapp: "+971504567890", description: "Partner at Emirates Legal Advisors — corporate law, real estate disputes and family law across the UAE.", image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=500&fit=crop&crop=faces", verified: 1, rating: 4.9, reviews_count: 302 },
        { name: "Omar Suleiman", category_id: catIds["legal"], city: "Sharjah", phone: "+971-6-5678901", email: "omar.suleiman@alkhaleejlaw.ae", whatsapp: "+971505678901", description: "Senior counsel at Al Khaleej Law Firm — civil, criminal and commercial litigation with bilingual legal teams.", image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=500&fit=crop&crop=faces", verified: 1, rating: 4.5, reviews_count: 121 },
        { name: "Rashid Al Nuaimi", category_id: catIds["trade-finance"], city: "Dubai", phone: "+971-4-6789012", email: "rashid.nuaimi@gulftradefinance.ae", whatsapp: "+971506789012", description: "Trade finance advisor at Gulf Trade Finance Partners — letters of credit, invoice financing and export/import solutions.", image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop&crop=faces", verified: 1, rating: 4.7, reviews_count: 94 },
        { name: "Yasmin Siddiqui", category_id: catIds["umrah-hajj"], city: "Sharjah", phone: "+971-6-7890123", email: "yasmin@noorumrah.ae", whatsapp: "+971507890123", description: "Travel consultant at Noor Umrah Travels — affordable Umrah packages with visa, hotel and transport support.", image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&h=500&fit=crop&crop=faces", verified: 1, rating: 4.9, reviews_count: 410 },
        { name: "Bilal Ahmed", category_id: catIds["umrah-hajj"], city: "Dubai", phone: "+971-4-8901234", email: "bilal@barakahtravels.ae", whatsapp: "+971508901234", description: "Coordinator at Barakah Hajj & Umrah Services — premium and economy group packages since 2009.", image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop&crop=faces", verified: 0, rating: 4.4, reviews_count: 76 },
        { name: "Hamdan Al Shamsi", category_id: catIds["business-setup"], city: "Dubai", phone: "+971-4-9012345", email: "hamdan@setupeasy.ae", whatsapp: "+971509012345", description: "Business setup consultant at Setup Easy — free zone and mainland company formation, PRO services, and licensing.", image_url: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=500&h=500&fit=crop&crop=faces", verified: 1, rating: 4.6, reviews_count: 138 },
        { name: "Layla Haddad", category_id: catIds["insurance"], city: "Abu Dhabi", phone: "+971-2-0123456", email: "layla@unionshield.ae", whatsapp: "+971500123456", description: "Insurance broker at Union Shield — health, motor and property insurance comparisons from top UAE insurers.", image_url: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=500&h=500&fit=crop&crop=faces", verified: 1, rating: 4.5, reviews_count: 167 },
      ];

      for (const a of agents) {
        await sql`
          INSERT INTO agents
            (name, category_id, city, phone, email, whatsapp, description, image_url, verified, rating, reviews_count)
          VALUES
            (${a.name}, ${a.category_id}, ${a.city}, ${a.phone}, ${a.email}, ${a.whatsapp}, ${a.description}, ${a.image_url}, ${a.verified}, ${a.rating}, ${a.reviews_count});
        `;
      }
    }

    sendJson(res, 200, {
      success: true,
      message: "Database ready. Tables created and sample data seeded (if it wasn't already).",
    });
  } catch (err) {
    sendJson(res, 500, { error: err.message });
  }
};
