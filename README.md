# ResumeAI — Telugu · Tamil · English Resume Builder

AI-powered resume builder with 5 language modes, bilingual side-by-side printing, and a secure backend that keeps your API key safe.

---

## 5 Language Modes

| Mode | Description |
|------|-------------|
| **తెలుగు + English** | Bilingual — Telugu left column, English right column, side-by-side print |
| **தமிழ் + English** | Bilingual — Tamil left column, English right column, side-by-side print |
| **Only తెలుగు** | Full resume written entirely in Telugu script |
| **Only தமிழ்** | Full resume written entirely in Tamil script |
| **Only English** | Professional English resume |

---

## Project Structure

```
resumeai/
├── frontend/
│   ├── index.html                  ← Main app (all UI + logic)
│   ├── netlify.toml                ← Netlify deployment config
│   └── netlify/
│       └── functions/
│           └── generate.js         ← Netlify serverless function (backend)
│
└── backend/
    ├── server.js                   ← Express backend (for self-hosting)
    ├── package.json
    └── .env.example                ← Copy to .env and add your API key
```

---

## Option A — Deploy on Netlify (Recommended, Free)

Netlify hosts both the frontend AND runs the backend as a serverless function.
**Your API key is stored securely in Netlify environment variables — never exposed to users.**

### Steps:

1. **Get your Anthropic API key**
   - Go to https://console.anthropic.com
   - Create an API key

2. **Upload to Netlify**
   - Go to https://netlify.com and sign up (free)
   - Click "Add new site" → "Deploy manually"
   - Drag and drop the **entire `frontend/` folder**
   - Your site will be live at `https://something.netlify.app`

3. **Add your API key**
   - In Netlify dashboard: Site Settings → Environment Variables
   - Click "Add a variable"
   - Key: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx` (your key)
   - Click Save

4. **Redeploy**
   - Go to Deploys tab → "Trigger deploy" → "Deploy site"
   - Done! Your app is live and secure.

---

## Option B — Deploy on Vercel (Also Free)

1. Install Vercel CLI: `npm i -g vercel`
2. In the `frontend/` folder run: `vercel`
3. Add environment variable in Vercel dashboard:
   - Settings → Environment Variables → `ANTHROPIC_API_KEY`

> Note: For Vercel you'll need to convert `netlify/functions/generate.js`
> to a Vercel API route at `api/generate.js`. The logic is identical.

---

## Option C — Self-Host with Express Backend

Use this if you want to run on your own server (VPS, Railway, Render, etc.)

### Run locally:

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Create your .env file
cp .env.example .env
# Edit .env and add: ANTHROPIC_API_KEY=sk-ant-...

# 3. Start the server
npm start
# Server runs at http://localhost:3001

# 4. Open frontend/index.html in browser
# (The app auto-detects localhost and calls http://localhost:3001/api/generate)
```

### Deploy backend to Railway (Free tier):

1. Go to https://railway.app
2. "New Project" → "Deploy from GitHub repo"
3. Point to your `backend/` folder
4. Add environment variable: `ANTHROPIC_API_KEY=your_key`
5. Update `API_URL` in `frontend/index.html` to your Railway URL

---

## Local Development (No backend — browser only)

For quick testing, you can temporarily hardcode the API key in `index.html`:

```js
// In index.html, replace the fetch call with a direct Anthropic call
// WARNING: Never do this in production — your key will be visible to users!
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | ✅ Yes | Your Anthropic API key from console.anthropic.com |
| `PORT` | No | Port for Express server (default: 3001) |
| `ALLOWED_ORIGIN` | No | CORS origin (default: `*`, set to your domain in production) |

---

## Tech Stack

- **Frontend**: Pure HTML + CSS + Vanilla JS (no framework, no build step)
- **Backend**: Node.js + Express (or Netlify Functions)
- **AI**: Claude claude-opus-4-5 via Anthropic API
- **Fonts**: Noto Sans Telugu, Noto Sans Tamil, Cormorant Garamond, DM Sans
- **Deployment**: Netlify (recommended) / Vercel / Railway / Any Node host

---

## Support

Built with Claude AI · Supports Telugu, Tamil & English
