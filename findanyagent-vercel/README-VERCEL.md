# FindAnyAgent — Vercel Deployment (Serverless + Neon Postgres)

Ye wahi FindAnyAgent local clone hai, lekin **Vercel par deploy** karne ke liye adapt kiya gaya hai:

- **Frontend:** Static HTML/CSS/JS (root level — Vercel khud serve karta hai)
- **Backend:** Har API route ek alag **Vercel Serverless Function** hai (`api/` folder ke andar)
- **Database:** **Neon Postgres** (Vercel ka current official Postgres option — free tier available)

> **Zaroori:** Local wale zip mein SQLite thi (file-based DB), jo Vercel par **kaam nahi karti** kyunke Vercel ki filesystem har request ke baad reset ho jati hai. Is liye yahan real cloud database (Postgres) use ki hai — data hamesha ke liye save rehta hai.

## Deploy Karne Ke Steps

### 1. GitHub par push karein
Vercel GitHub se directly deploy karta hai. Agar aapke paas GitHub account nahi hai to [github.com](https://github.com) par free bana lein.

```bash
cd findanyagent-vercel
git init
git add .
git commit -m "Initial commit"
```

Phir GitHub par ek naya (empty) repository banayein aur:
```bash
git remote add origin <aapki-repo-ka-URL>
git branch -M main
git push -u origin main
```

### 2. Vercel par project import karein
1. [vercel.com](https://vercel.com) par jayein aur sign up/login karein (GitHub se login karna sabse aasan hai)
2. **Add New → Project**
3. Apni GitHub repository select karein → **Import**
4. Framework preset "Other" rahega — koi build settings change karne ki zaroorat nahi
5. **Deploy** par click karein

Pehli deployment fail ho sakti hai ya blank data dikha sakti hai — koi masla nahi, database abhi connect nahi hui.

### 3. Neon Postgres Database add karein
1. Apne Vercel project ke dashboard mein **Storage** tab par jayein
2. **Create Database** → **Postgres (by Neon)** select karein
3. Naam dein aur **Create** karein
4. Ye automatically `DATABASE_URL` environment variable aapke project mein add kar dega

### 4. Redeploy karein
Database connect hone ke baad, **Deployments** tab mein jayein aur latest deployment ke "..." menu se **Redeploy** karein (taake naya environment variable load ho).

### 5. Database seed karein (sirf ek dafa)
Apni deployed site ka URL browser mein kholein aur `/api/setup` par jayein:
```
https://your-project-name.vercel.app/api/setup
```
Ye tables bana dega aur 6 categories + 10 sample agents seed kar dega. Response mein `"success": true` dikhna chahiye.

### 6. Website dekhein
```
https://your-project-name.vercel.app
```

Ab pura site live hai — homepage, agent listing, search/filter, agent profile, contact form, aur admin panel sab kaam karenge.

## Project Structure

```
findanyagent-vercel/
├── api/                    # Serverless functions (backend)
│   ├── _db.js               # Neon Postgres connection helper (not a route)
│   ├── setup.js              # One-time: creates tables + seeds data
│   ├── categories/
│   │   ├── index.js           # GET /api/categories
│   │   └── [slug].js          # GET /api/categories/:slug
│   ├── agents/
│   │   ├── index.js           # GET/POST /api/agents
│   │   ├── cities.js          # GET /api/agents/cities
│   │   └── [id].js            # GET/DELETE /api/agents/:id
│   └── inquiries/
│       └── index.js           # GET/POST /api/inquiries
├── index.html, css/, js/, pages/, images/   # Frontend (served statically)
├── package.json
└── vercel.json
```

## Local Testing (Optional)

Agar deploy karne se pehle local par test karna hai, [Vercel CLI](https://vercel.com/docs/cli) use kar sakte hain:

```bash
npm install -g vercel
vercel login
vercel env pull        # DATABASE_URL waghera .env.local mein le aayega (Neon add karne ke baad)
vercel dev
```

## Notes

- `/api/setup` endpoint public hai (bina password) — sirf demo/learning ke liye theek hai. Agar ye production site banani ho to isay ek secret key ya authentication ke peeche lock kar dein.
- Neon ka free tier is chhote project ke liye kaafi hai.
- Agent add/delete admin panel (`/pages/admin.html`) se bhi kaam karega, kyunke wo bhi isi API se connect hai.
