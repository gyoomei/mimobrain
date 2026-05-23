# 🧠 MimoBrain

> Daily brain workout powered by Xiaomi MiMo V2.5 — train your mind through lateral thinking, riddles, memory games, math puzzles, and pattern recognition. Real-time Socratic chat with Mentor MiMo who never gives away the answer.

[![Live Demo](https://img.shields.io/badge/Live-Demo-00d4ff?style=for-the-badge)](https://gyoomei.github.io/mimobrain/)
[![Powered by MiMo](https://img.shields.io/badge/Powered_by-MiMo_V2.5-ff3da6?style=for-the-badge)](https://mimo.xiaomi.com)
[![License](https://img.shields.io/badge/License-MIT-ffb627?style=for-the-badge)](LICENSE)
[![Single File](https://img.shields.io/badge/Architecture-Single_HTML-07091a?style=for-the-badge)](.)
[![No API Key](https://img.shields.io/badge/API_Key-None-00ffa3?style=for-the-badge)](.)

🔗 **Live**: https://gyoomei.github.io/mimobrain/
📂 **Source**: https://github.com/gyoomei/mimobrain

---

## 📖 The Idea

The brain is the only muscle most people never deliberately train. We pay for gym memberships, run interval workouts, and obsess over diet, but cognition gets whatever scraps are left at the end of a workday. Worse: when most people DO try a brain-training app, they get hand-held — instant hints, animated tutorials, the answer one tap away. That defeats the point. **The struggle IS the workout.**

**MimoBrain** flips this on its head. A 6-agent pipeline serves you 24 hand-picked puzzles across 5 cognitive domains, but the central agent — Mentor MiMo — refuses to give you answers. Ask "what's the answer to the bridge crossing?" and Mentor MiMo replies with a question that makes you find it yourself. Socratic method, real-time, free.

---

## 🎯 What it does

```
You pick:    "The Bridge Crossing" (math, difficulty ●●○)
MimoBrain:   Shows the puzzle. Locks 3 hints behind clickable veils.
             Tracks attempts and solves to localStorage.
You ask:     "Just give me the answer please."
Mentor MiMo: "I hear you're stuck. First question: what is the OBJECTIVE
              of the puzzle? What are you trying to minimize?"
You think:   "...minimum total time."
Mentor MiMo: "Good. Second question: when two people cross together,
              the pair moves at the SLOWER person's pace. What is the
              benefit of having the two SLOWEST cross together?"
You think:   "Oh — they only burn the slow time ONCE."
Mentor MiMo: "Exactly. Now design the sequence. I won't help further."
```

That's the loop. The puzzle stays hard. The mentor refuses to soften it. Your brain does the lift.

---

## ✨ Six agents, one brain

| # | Agent | Role | What it does |
|---|---|---|---|
| 01 | **Curator** | Cataloger | Indexes 24 curated puzzles across 5 cognitive domains, filters by category and difficulty |
| 02 | **Coach** | Pacing | Reveals hints progressively. Each unlock costs no penalty — but a solve without hints is its own reward |
| 03 | **Mentor MiMo** | Socratic | Real-time tutor via Pollinations gateway → MiMo V2.5. Refuses direct answers, only sharper questions |
| 04 | **Tracker** | Metrics | Logs every attempt and solve to localStorage. Computes streak, solve rate, and per-category strength |
| 05 | **Translator** | Bilingual | Every string flips between English and Bahasa Indonesia mid-flow without losing render state |
| 06 | **Narrator** | Encourager | Composes contextual prose around your stats and recent wins, reframes struggle as practice |

---

## 🛠️ Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | Vanilla HTML/CSS/JS | Zero build, opens directly in browser, bulletproof deploys |
| Puzzles | Curated JSON, 24 hand-picked challenges | 5 categories × multiple difficulties, fully bilingual, ~21 KB |
| Mentor chat | Pollinations.ai → MiMo V2.5 | Free LLM gateway, no API key, with `?referrer=mimobrain` |
| Hosting | GitHub Pages | Free, CDN-backed, instant rollback via git |
| Persistence | localStorage | Streak, solves, attempts, hints used — all client-side |
| Bilingual | Full EN/ID toggle | Every string through `t()`, mentor system prompt re-wires per language |
| Anti-drift | 3-layer language fix | Strict prompt + temperature 0.7 + Malay→ID regex normalizer |
| Fonts | Space Grotesk + Inter + JetBrains Mono | Display + body + technical mono triad |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Hero stats panel (Tracker output)                           │
│   STREAK  SOLVED  ATTEMPTS  SUCCESS RATE                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │  01. Curator Agent                   │
        │   Filter 24 puzzles by category      │
        │   ALL · LATERAL · RIDDLE · MEMORY    │
        │   MATH · PATTERN                     │
        └──────────┬───────────────────────────┘
                   │
                   ▼
        ┌──────────────────────────────────────┐
        │  Puzzle grid (3×N cards)             │
        │   tag · diff dots · title · prompt   │
        │   solved tag green border + ✓        │
        └──────────┬───────────────────────────┘
                   │   click card
                   ▼
        ┌──────────────────────────────────────┐
        │  02. Coach Agent                     │
        │   Modal: prompt + locked hints       │
        │   Reveal one at a time on click      │
        │   Toggle answer (visible reset)      │
        │   Mark solved → Tracker.recordSolve  │
        └──────────┬───────────────────────────┘
                   │   click "Ask Mentor"
                   ▼
        ┌──────────────────────────────────────────────────────┐
        │  03. Mentor MiMo Agent  (live Socratic chat)         │
        │   POST text.pollinations.ai/openai?referrer=mimobrain│
        │   model: openai-fast → Xiaomi MiMo V2.5              │
        │                                                       │
        │   System prompt: NEVER give direct answer            │
        │                  Always lead with questions          │
        │                  Validate user reasoning             │
        │   Context injected: current puzzle title + prompt    │
        │   Language locked to STATE.lang at request time      │
        │                                                       │
        │   ID mode: 11-token Malay→ID regex normalizer        │
        │   on returned text before render                     │
        └──────────────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────────────────┐
  │  04. Tracker Agent                                        │
  │     localStorage key: mimobrain-tracker                   │
  │     { solved: {id: ts}, attempts: {id: n},                │
  │       hintsUsed: {id: n}, lastSolveDate, streak }         │
  │     Streak resets if last solve > 1 day ago               │
  └──────────────────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────────────────┐
  │  05. Translator Agent                                     │
  │     I18N table EN/ID for every visible string             │
  │     Function strings (t('catCount', n)) for plurals       │
  │     Mentor system prompt rebuilt per language toggle      │
  └──────────────────────────────────────────────────────────┘
```

---

## 🎨 Design language

- **Aesthetic**: Neuroscience lab (deep midnight + electric cyan + magenta accent)
- **Display font**: Space Grotesk 700 — geometric, technical, modern
- **Body**: Inter 400/500/600
- **Mono**: JetBrains Mono — labels, agent IDs, eyebrows, badges
- **Palette dark**: void midnight `#07091a`, electric cyan `#00d4ff`, magenta `#ff3da6`, amber `#ffb627`
- **Palette light**: paper white `#fafbff`, deep ink `#0a0c2c`, ocean cyan `#006e94`, ruby magenta `#c91577`
- **Atmosphere**: Triple radial gradient drift (24s loop), subtle parallax on hover
- **Restraint**: Single primary gradient (cyan → magenta) reserved for hero word + buttons + agent number badges only

---

## 🚀 Try these puzzles

| Category | Puzzle | Difficulty |
|---|---|---|
| Lateral | Two Doors, Two Guards | ●●● |
| Riddle | Speaks Without a Mouth | ●● |
| Memory | Color Pattern — Simon Says | ●● |
| Math | The Bridge Crossing | ●● |
| Math | The 12 Balls | ●●● |
| Pattern | Letter Sequence (O T T F F S S E ?) | ● |
| Pattern | Tribonacci | ●● |

Bridge Crossing is the gateway drug — most people get there in 5 minutes once they realize the slowest two should cross together.

---

## 🧪 Why Socratic?

Traditional answer-driven Q&A turns AI into a vending machine: pull the lever, get the candy. **You learn nothing.**

Socratic dialog treats the AI as a tutor with a rule: never reduce the cognitive load. Every reply must contain at least one new question. The user does the thinking; the mentor only narrows the search space. Done well, you arrive at the answer believing you found it yourself — because you did.

Mentor MiMo's system prompt has 3 hard constraints:
1. Never answer directly. Always reply with at least one leading question.
2. Validate the user's current reasoning before correcting it.
3. Break the problem into the smallest possible step, ask about that step only.

Combined with `temperature: 0.7` and the Malay→ID normalizer (a cross-application pattern proven on MimoChef), the model stays on-rule across 5+ test conversations.

---

## 🌐 Run locally

```bash
git clone https://github.com/gyoomei/mimobrain.git
cd mimobrain
python3 -m http.server 8782
# open http://localhost:8782
```

Zero build step. No npm. No environment variables.

---

## 🗺️ Roadmap

- [ ] Daily puzzle of the day with email notification
- [ ] Active memory games (Simon Says with click-to-play, Number Span input)
- [ ] User-submitted puzzles (PR-based)
- [ ] Per-category difficulty progression (puzzles unlock as you solve easier ones)
- [ ] Leaderboard for friend groups (shared challenge codes)
- [ ] Voice-mode Socratic chat for hands-free practice
- [ ] PWA installation + offline mode

---

## 🙏 Acknowledgements

- **Xiaomi MiMo V2.5** — the reasoning model powering Mentor MiMo's Socratic tutoring
- **Pollinations.ai** — free LLM gateway with no API key required
- **Space Grotesk, Inter, JetBrains Mono** — typography
- **Plato** — for inventing the Socratic method 2,400 years ago and refusing to give us the answer

---

## 📄 License

MIT © 2026 [@gyoomei](https://github.com/gyoomei)

**Built with ❤ on MiMo V2.5 · Submitted to [Xiaomi MiMo 100T](https://100t.xiaomimimo.com/)**
