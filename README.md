# Digital VLSI Workbench

Engineering reference and study tool for the **Digital VLSI** laboratory course (ETPCL502) — TE Semester V, Electronics & Telecommunication Engineering.

Built to look and operate like professional EDA software (Xilinx Vivado / Microwind), not a general-purpose web app.

---

## Features

- **12 Experiments** fully indexed from the lab manual (ETPCL502)
- EDA-style interface: sidebar, tabbed workspace, status bar, compact toolbar
- Tabs: Overview, Theory, Code (with syntax highlighting), Truth Table, Viva Questions
- **Groq AI Assistant** — answers questions using the lab manual as context
- Global search (Ctrl+K) across experiments, concepts, and Verilog modules
- Viva quiz mode with shuffle, show/hide answers, difficulty filtering
- Persistent panel state (localStorage)
- Responsive layout for laptop and tablet screens
- Experiment 8 manual discrepancy flagged (Full Adder vs. 8-Bit Adder)

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + custom CSS |
| Icons | Lucide React |
| AI API | Groq SDK |
| Markdown | react-markdown + remark-gfm |
| Deployment | Vercel |

---

## Local Development

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd website

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local

# 4. Add your Groq API key to .env.local
# (see Environment Variables section below)

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create `.env.local` in the project root (never commit this file):

```env
GROQ_API_KEY=gsk_your_actual_groq_api_key_here
GROQ_MODEL=llama-3.1-8b-instant
```

### Getting a Groq API Key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up / log in
3. Navigate to API Keys → Create API Key
4. Copy the key and paste it in `.env.local`

### Available Groq Models

The `GROQ_MODEL` variable is optional. Defaults to `llama-3.1-8b-instant`.

Other supported models (check Groq console for availability):
- `llama-3.1-70b-versatile` — More capable, slower
- `llama-3.3-70b-versatile` — Latest Llama 3.3
- `mixtral-8x7b-32768` — Larger context window
- `gemma2-9b-it` — Google Gemma

> **Note:** Never use `NEXT_PUBLIC_` prefix for the API key. This would expose it to the browser.

---

## Production Build

```bash
npm run build
npm start
```

---

## Vercel Deployment

### First Time

1. Push your code to a GitHub repository (ensure `.env.local` is in `.gitignore` — it already is).

2. Go to [vercel.com](https://vercel.com) and import the repository.

3. In Vercel dashboard → **Settings → Environment Variables**, add:
   - `GROQ_API_KEY` = your Groq API key
   - `GROQ_MODEL` = `llama-3.1-8b-instant` (or your preferred model)

4. Deploy. Vercel automatically runs `npm run build`.

### Redeployment

Push new commits to your default branch — Vercel will auto-deploy.

---

## Manual Import / Update

The lab manual content (ETPCL502) is embedded directly in:

```
lib/experiments.ts
```

This file contains all 12 experiments with their:
- Aim, theory, procedure (verbatim from manual)
- Verilog programs (verbatim from manual)
- Truth tables
- Viva questions
- Manual page references

### To Update an Experiment

Edit `lib/experiments.ts` directly. Each experiment is a typed object. Never silently change the original manual content — add a `discrepancyNote` field instead.

### To Add a New Experiment

Add a new entry to the `experiments` array following the existing structure. Rebuild and redeploy.

### Re-extracting from the PDF

The original PDF (`notes.pdf`) was extracted using PyMuPDF. To re-extract:

```bash
pip install pymupdf
python extract_pdf.py  # (provided in parent DVLSI directory)
```

The extracted content in `pdf_content.json` can be used as a reference.

---

## Manual Discrepancy — Experiment 8

The lab manual index lists Experiment 8 as **"Full Adder"** but:
- The program heading reads: **"Verilog Code for 8 BIT ADDER"**
- The module implements an **8-bit adder**: `module adderm(a, b, sum, carry)` with `input [7:0] a`
- The conclusion reads: **"The Verilog program for 8-Bit Adder were written..."**

This discrepancy is preserved verbatim and flagged with a visible warning in the Code tab. The original code has not been modified.

---

## Troubleshooting

### AI Not Working

| Symptom | Fix |
|---------|-----|
| "AI NOT CONFIGURED" in toolbar | Add `GROQ_API_KEY` to `.env.local` and restart dev server |
| "Invalid API key" error | Check the key is correct and starts with `gsk_` |
| "Rate limit" error | Wait 30–60 seconds and retry. Groq free tier has rate limits |
| "Model not found" error | Check `GROQ_MODEL` — use a supported model name from console.groq.com |
| Works locally but not on Vercel | Add env vars in Vercel dashboard → Settings → Environment Variables |

### Build Errors

```bash
# Clear Next.js cache and rebuild
rm -rf .next
npm run build
```

### Port Already in Use

```bash
npm run dev -- -p 3001
```

---

## Project Structure

```
website/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts      # Groq API route (server-side only)
│   ├── globals.css           # EDA-style design system
│   ├── layout.tsx            # Root layout + metadata
│   └── page.tsx              # Main workbench page
├── components/
│   ├── tabs/
│   │   ├── OverviewTab.tsx
│   │   ├── TheoryTab.tsx
│   │   ├── CodeTab.tsx
│   │   ├── TruthTableTab.tsx
│   │   └── VivaTab.tsx
│   ├── AIAssistant.tsx
│   ├── SearchModal.tsx
│   ├── SettingsPanel.tsx
│   └── Sidebar.tsx
├── lib/
│   ├── experiments.ts        # All experiment data from the manual
│   └── search.ts             # Search + AI context utilities
├── .env.example              # Environment variable template
├── .env.local                # Your actual keys (gitignored)
└── README.md
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Open global search |
| `Escape` | Close search / settings |
| `Enter` | Send AI message |
| `Shift+Enter` | New line in AI input |

---

## Academic Context

- **Course**: Digital VLSI (ETPCL502)
- **Department**: Electronics and Telecommunication Engineering
- **Semester**: TE, V (Academic Year 2026–27)
- **Tools used in lab**: Microwind (layout), Xilinx Vivado 2025 (Verilog HDL)
