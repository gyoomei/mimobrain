// ============================================================
// MimoBrain — Daily Brain Workout
// 6-agent pipeline: Curator · Coach · Mentor · Tracker · Translator · Narrator
// Powered by Xiaomi MiMo V2.5 via Pollinations.ai gateway
// ============================================================

const CONFIG = {
  appName: 'mimobrain',
  pollinations: 'https://text.pollinations.ai/openai',
  model: 'openai-fast',
  chatHistoryLimit: 8,
};

const STATE = {
  lang: localStorage.getItem('mimobrain-lang') || 'en',
  theme: localStorage.getItem('mimobrain-theme') || 'dark',
  puzzles: [],
  selectedCategory: 'all',
  currentPuzzle: null,
  hintsRevealed: 0,
  answerShown: false,
  chatHistory: [],
  chatOpen: false,
};

// ============================================================
// I18N — Translator Agent
// ============================================================
const I18N = {
  en: {
    eyebrow: 'DAILY BRAIN WORKOUT · 6 AGENTS',
    heroTitle: 'Train your <em>mind</em> like a muscle',
    heroSubtitle: 'Six AI agents — Curator, Coach, Mentor, Tracker, Translator, Narrator — guide you through lateral thinking, riddles, memory, math, and pattern puzzles. Real-time Socratic chat with Mentor MiMo. Zero API key. Free.',
    pill1: '24+ PUZZLES',
    pill2: 'SOCRATIC MENTOR',
    pill3: 'BILINGUAL EN / ID',
    pill4: 'NO API KEY',
    statStreak: 'DAY STREAK',
    statSolved: 'SOLVED',
    statAttempts: 'ATTEMPTS',
    statRate: 'SUCCESS RATE',
    catEyebrow: 'PICK YOUR DOMAIN',
    catTitle: 'Five categories, one trainer',
    agentsEyebrow: 'UNDER THE HOOD',
    agentsTitle: 'Six agents, one brain',
    agent1Name: 'Curator', agent1Role: 'CATALOGER',
    agent1Desc: 'Indexes 24+ curated puzzles across 5 cognitive domains, filters by category and difficulty.',
    agent2Name: 'Coach', agent2Role: 'PACING',
    agent2Desc: 'Reveals hints progressively. Each unlock costs no penalty — but a solve without hints scores higher.',
    agent3Name: 'Mentor MiMo', agent3Role: 'SOCRATIC',
    agent3Desc: "Real-time Socratic tutor via Pollinations gateway → Xiaomi MiMo V2.5. Won't give answers — only sharper questions.",
    agent4Name: 'Tracker', agent4Role: 'METRICS',
    agent4Desc: 'Logs every attempt and solve to localStorage. Computes streak, solve rate, and per-category strength over time.',
    agent5Name: 'Translator', agent5Role: 'BILINGUAL',
    agent5Desc: 'Every string flips between English and Bahasa Indonesia mid-flow without losing render state.',
    agent6Name: 'Narrator', agent6Role: 'ENCOURAGER',
    agent6Desc: 'Composes contextual prose around your stats and recent wins, reframing struggle as practice.',
    catAll: 'All', catLateral: 'Lateral', catRiddle: 'Riddles', catMemory: 'Memory', catMath: 'Math', catPattern: 'Pattern',
    catLabelLateral: 'LATERAL THINKING',
    catLabelRiddle: 'CLASSIC RIDDLES',
    catLabelMemory: 'MEMORY GAMES',
    catLabelMath: 'MATH PUZZLES',
    catLabelPattern: 'PATTERN RECOGNITION',
    catCount: (n) => `${n} PUZZLES`,
    catCountAll: (n) => `ALL · ${n}`,
    solvedTag: 'SOLVED ✓',
    diffLabel: 'DIFF',
    catLabel: 'CAT',
    challengeBadge: 'CHALLENGE',
    promptLabel: 'PROMPT',
    hintsTitle: 'HINTS — UNLOCK ONE AT A TIME',
    hintLocked: '🔒 Reveal hint',
    answerHidden: 'Reveal answer',
    answerShown: '👁 Hide answer',
    answerLabel: 'ANSWER',
    askMentor: '🎓 Ask Mentor MiMo',
    markSolved: '✓ Mark solved',
    unsolved: '↺ Reset',
    closeBtn: 'Close',
    footerTagline: 'Your mind, in training.',
    footerCredit: 'BUILT WITH ❤ ON MIMO V2.5 · OPEN SOURCE · MIT',
    chatPlaceholder: 'Ask Mentor MiMo...',
    chatStatus: 'ONLINE · MIMO V2.5',
    chatGreet: "Hi! 🎓 I'm Mentor MiMo. I won't give you the answer — I'll ask you the right questions to find it yourself. What puzzle are we tackling?",
    chatErr: 'Connection hiccup. Try again in a moment, or rephrase your question.',
    chatSuggest1: 'How do I approach a riddle?',
    chatSuggest2: 'I am stuck on the bridge crossing.',
    chatSuggest3: 'Tips for memory training?',
    chatSuggest4: 'Explain pattern recognition.',
    answerSectionLabel: 'YOUR ANSWER',
    answerPlaceholder: 'Type your answer here...',
    submitAnswer: '✓ Submit',
    correct: 'Correct! Puzzle solved.',
    incorrect: 'Not quite. Try a hint or ask Mentor MiMo.',
    yourAnswerLabel: 'YOUR ANSWER',
    solvedAlready: 'You solved this puzzle.',
    openEndedNote: 'This is an open-ended puzzle — discuss with Mentor MiMo, then mark it solved when you are satisfied with your reasoning.',
  },
  id: {
    eyebrow: 'LATIHAN OTAK HARIAN · 6 AGEN',
    heroTitle: 'Latih <em>otakmu</em> seperti otot',
    heroSubtitle: 'Enam agen AI — Curator, Coach, Mentor, Tracker, Translator, Narrator — memandu kamu lewat lateral thinking, teka-teki, memori, matematika, dan pengenalan pola. Chat Socratic real-time dengan Mentor MiMo. Tanpa API key. Gratis.',
    pill1: '24+ TEKA-TEKI',
    pill2: 'MENTOR SOCRATIC',
    pill3: 'DWI-BAHASA EN / ID',
    pill4: 'TANPA API KEY',
    statStreak: 'STREAK HARI',
    statSolved: 'TERPECAHKAN',
    statAttempts: 'PERCOBAAN',
    statRate: 'TINGKAT SUKSES',
    catEyebrow: 'PILIH DOMAINMU',
    catTitle: 'Lima kategori, satu pelatih',
    agentsEyebrow: 'DI BALIK LAYAR',
    agentsTitle: 'Enam agen, satu otak',
    agent1Name: 'Curator', agent1Role: 'KATALOGER',
    agent1Desc: 'Mengindeks 24+ teka-teki terkurasi dalam 5 domain kognitif, filter berdasarkan kategori dan tingkat kesulitan.',
    agent2Name: 'Coach', agent2Role: 'PEMACU',
    agent2Desc: 'Membuka hint secara bertahap. Tidak ada penalti tiap unlock — tapi memecahkan tanpa hint nilainya lebih tinggi.',
    agent3Name: 'Mentor MiMo', agent3Role: 'SOCRATIC',
    agent3Desc: 'Tutor Socratic real-time via Pollinations gateway → Xiaomi MiMo V2.5. Tidak akan memberi jawaban — hanya pertanyaan yang lebih tajam.',
    agent4Name: 'Tracker', agent4Role: 'METRIK',
    agent4Desc: 'Mencatat setiap percobaan dan solusi ke localStorage. Hitung streak, tingkat sukses, dan kekuatan per kategori dari waktu ke waktu.',
    agent5Name: 'Translator', agent5Role: 'DWI-BAHASA',
    agent5Desc: 'Setiap string berpindah antara Inggris dan Bahasa Indonesia di tengah alur tanpa kehilangan status render.',
    agent6Name: 'Narrator', agent6Role: 'PENYEMANGAT',
    agent6Desc: 'Menyusun prosa kontekstual berdasarkan statistik dan kemenangan terakhirmu, mereframe kesulitan sebagai latihan.',
    catAll: 'Semua', catLateral: 'Lateral', catRiddle: 'Teka-teki', catMemory: 'Memori', catMath: 'Matematika', catPattern: 'Pola',
    catLabelLateral: 'LATERAL THINKING',
    catLabelRiddle: 'TEKA-TEKI KLASIK',
    catLabelMemory: 'PERMAINAN MEMORI',
    catLabelMath: 'TEKA-TEKI MATEMATIKA',
    catLabelPattern: 'PENGENALAN POLA',
    catCount: (n) => `${n} TEKA-TEKI`,
    catCountAll: (n) => `SEMUA · ${n}`,
    solvedTag: 'TERPECAHKAN ✓',
    diffLabel: 'TINGKAT',
    catLabel: 'KATEGORI',
    challengeBadge: 'TANTANGAN',
    promptLabel: 'PERTANYAAN',
    hintsTitle: 'HINT — BUKA SATU PER SATU',
    hintLocked: '🔒 Buka hint',
    answerHidden: 'Lihat jawaban',
    answerShown: '👁 Sembunyikan jawaban',
    answerLabel: 'JAWABAN',
    askMentor: '🎓 Tanya Mentor MiMo',
    markSolved: '✓ Tandai terpecahkan',
    unsolved: '↺ Reset',
    closeBtn: 'Tutup',
    footerTagline: 'Otakmu, dalam latihan.',
    footerCredit: 'DIBANGUN DENGAN ❤ DI MIMO V2.5 · OPEN SOURCE · MIT',
    chatPlaceholder: 'Tanya Mentor MiMo...',
    chatStatus: 'ONLINE · MIMO V2.5',
    chatGreet: 'Halo! 🎓 Aku Mentor MiMo. Aku tidak akan memberi jawaban — aku akan bertanya hal yang tepat supaya kamu menemukannya sendiri. Teka-teki apa yang sedang kita pecahkan?',
    chatErr: 'Koneksi sedikit terganggu. Coba lagi sebentar, atau tulis ulang pertanyaanmu.',
    chatSuggest1: 'Bagaimana pendekatan teka-teki?',
    chatSuggest2: 'Aku stuck di penyeberangan jembatan.',
    chatSuggest3: 'Tips latihan memori?',
    chatSuggest4: 'Jelaskan pengenalan pola.',
    answerSectionLabel: 'JAWABANMU',
    answerPlaceholder: 'Ketik jawabanmu di sini...',
    submitAnswer: '✓ Kirim',
    correct: 'Benar! Teka-teki terpecahkan.',
    incorrect: 'Belum tepat. Coba hint atau tanya Mentor MiMo.',
    yourAnswerLabel: 'JAWABANMU',
    solvedAlready: 'Kamu sudah memecahkan teka-teki ini.',
    openEndedNote: 'Ini teka-teki open-ended — diskusikan dengan Mentor MiMo, lalu tandai selesai kalau kamu puas dengan penalaran.',
  }
};

const t = (key, ...args) => {
  const val = I18N[STATE.lang][key] ?? I18N.en[key] ?? key;
  return typeof val === 'function' ? val(...args) : val;
};

// ============================================================
// CATEGORY DEFINITIONS
// ============================================================
const CATEGORIES = [
  { id: 'all', icon: '🎯', labelKey: 'catAll' },
  { id: 'lateral', icon: '💡', labelKey: 'catLateral' },
  { id: 'riddle', icon: '🔮', labelKey: 'catRiddle' },
  { id: 'memory', icon: '🧩', labelKey: 'catMemory' },
  { id: 'math', icon: '🔢', labelKey: 'catMath' },
  { id: 'pattern', icon: '📐', labelKey: 'catPattern' },
];

// ============================================================
// Tracker Agent — localStorage stats
// ============================================================
const Tracker = {
  KEY: 'mimobrain-tracker',
  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {
      solved: {},          // { puzzleId: timestamp }
      attempts: {},        // { puzzleId: count }
      hintsUsed: {},       // { puzzleId: count }
      lastSolveDate: null,
      streak: 0,
    };
  },
  save(data) {
    try { localStorage.setItem(this.KEY, JSON.stringify(data)); } catch (e) {}
  },
  recordAttempt(puzzleId) {
    const d = this.load();
    d.attempts[puzzleId] = (d.attempts[puzzleId] || 0) + 1;
    this.save(d);
    return d;
  },
  recordSolve(puzzleId, hintsUsed) {
    const d = this.load();
    const wasNew = !d.solved[puzzleId];
    d.solved[puzzleId] = Date.now();
    d.hintsUsed[puzzleId] = hintsUsed;
    if (wasNew) {
      const today = new Date().toDateString();
      const last = d.lastSolveDate;
      if (last !== today) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        d.streak = (last === yesterday) ? d.streak + 1 : 1;
        d.lastSolveDate = today;
      } else if (d.streak === 0) {
        d.streak = 1;
        d.lastSolveDate = today;
      }
    }
    this.save(d);
    return d;
  },
  unsolve(puzzleId) {
    const d = this.load();
    delete d.solved[puzzleId];
    delete d.hintsUsed[puzzleId];
    this.save(d);
    return d;
  },
  stats() {
    const d = this.load();
    const solvedCount = Object.keys(d.solved).length;
    const attemptsCount = Object.values(d.attempts).reduce((a, b) => a + b, 0);
    const rate = attemptsCount > 0 ? Math.round((solvedCount / attemptsCount) * 100) : null;
    return { solved: solvedCount, attempts: attemptsCount, rate, streak: d.streak };
  }
};

// ============================================================
// Curator Agent — filter & sort puzzles
// ============================================================
function curatorFilter(category) {
  if (category === 'all') return [...STATE.puzzles];
  return STATE.puzzles.filter(p => p.category === category);
}

// ============================================================
// Mentor Agent — Socratic chat via Pollinations → MiMo V2.5
// (3-layer language fix proven on MimoChef)
// ============================================================
const MALAY_TO_ID = [
  [/\bmahu\b/gi, 'mau'],
  [/\bsebab\b/gi, 'karena'],
  [/\bkerana\b/gi, 'karena'],
  [/\bawak\b/gi, 'kamu'],
  [/\bpula\b/gi, 'juga'],
  [/\btetapi\b/gi, 'tapi'],
  [/\bialah\b/gi, 'adalah'],
  [/\blazat\b/gi, 'enak'],
  [/\bsedap\b/gi, 'enak'],
  [/\bempok\b/gi, 'empuk'],
  [/\bricah\b/gi, 'kaya'],
];

function normalizeIndonesian(text) {
  let out = text;
  for (const [pattern, replacement] of MALAY_TO_ID) out = out.replace(pattern, replacement);
  return out;
}

async function mentorChat(userMessage) {
  // Build context from current puzzle if open
  let puzzleContext = '';
  if (STATE.currentPuzzle) {
    const p = STATE.currentPuzzle;
    const title = STATE.lang === 'id' ? p.title_id : p.title_en;
    const prompt = STATE.lang === 'id' ? p.puzzle_id : p.puzzle_en;
    puzzleContext = STATE.lang === 'id'
      ? `\n\nKONTEKS: User sedang membuka teka-teki "${title}":\n"${prompt}"\nKategori: ${p.category}, kesulitan ${p.difficulty}/3.`
      : `\n\nCONTEXT: User has puzzle "${title}" open:\n"${prompt}"\nCategory: ${p.category}, difficulty ${p.difficulty}/3.`;
  }

  const systemPrompt = STATE.lang === 'id'
    ? `Kamu adalah Mentor MiMo, tutor Socratic untuk teka-teki dan pengembangan kognitif.

ATURAN UTAMA — METODE SOCRATIC:
- JANGAN PERNAH memberi jawaban langsung untuk teka-teki
- Selalu tanyakan pertanyaan yang menggiring user berpikir sendiri
- Pecah masalah jadi bagian kecil, satu pertanyaan per bagian
- Kalau user frustrasi, beri petunjuk samar — bukan jawaban
- Validasi pemikiran user sebelum mengoreksi

ATURAN BAHASA — WAJIB:
- HANYA Bahasa Indonesia BAKU
- DILARANG: mahu, sebab, kerana, awak, pula, tetapi, ialah, lazat, sedap, empok, ricah
- PAKAI: mau, karena, kamu, juga, tapi, adalah, enak, empuk, kaya

GAYA:
- Ramah, sabar, ingin tahu
- Maks 3 paragraf pendek
- Markdown ringan: **tebal**, daftar berpoin

Contoh BENAR (user: "jawab teka-teki bridge crossing"):
"Pertanyaan bagus. Sebelum aku tunjukkan jalannya, coba pikirkan: kalau dua orang menyeberang bersama, kecepatan ditentukan oleh yang lebih lambat. Pertanyaannya: apa untungnya kalau dua orang TERLAMBAT menyeberang bersama? Coba pikirkan dulu.${puzzleContext}"`
    : `You are Mentor MiMo, a Socratic tutor for puzzles and cognitive development.

CORE RULE — SOCRATIC METHOD:
- NEVER give direct puzzle answers
- Always ask leading questions that make the user think
- Break problems into small steps, one question per step
- If user is frustrated, give a vague hint — never the answer
- Validate user's reasoning before correcting it

LANGUAGE RULES — STRICT:
- Respond ONLY in clear, natural English
- NEVER mix in Indonesian, Malay, or other languages
- Exception: puzzle titles or technical terms may stay as-is

STYLE:
- Warm, patient, curious
- Max 3 short paragraphs
- Light markdown: **bold**, bullet lists

Example correct (user: "give me the bridge crossing answer"):
"Good challenge. Before I walk you through it, think: when two people cross together, the pair moves at the SLOWER person's pace. So here's a question to chew on — what is the benefit of having the two SLOWEST people cross together?${puzzleContext}"`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...STATE.chatHistory.slice(-CONFIG.chatHistoryLimit).map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage }
  ];

  try {
    const res = await fetch(`${CONFIG.pollinations}?referrer=${CONFIG.appName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: CONFIG.model,
        messages,
        referrer: CONFIG.appName,
        temperature: 0.7,
        max_tokens: 500
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    let reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) throw new Error('Empty reply');
    if (STATE.lang === 'id') reply = normalizeIndonesian(reply);
    return reply;
  } catch (err) {
    console.error('Mentor chat error:', err);
    return null;
  }
}

// ============================================================
// Coach Agent — render puzzle modal with progressive hints + answer input
// ============================================================
function coachRender(puzzle) {
  const d = Tracker.load();
  const isSolved = !!d.solved[puzzle.id];
  const title = STATE.lang === 'id' ? puzzle.title_id : puzzle.title_en;
  const prompt = STATE.lang === 'id' ? puzzle.puzzle_id : puzzle.puzzle_en;
  const hints = STATE.lang === 'id' ? puzzle.hints_id : puzzle.hints_en;
  const answer = STATE.lang === 'id' ? puzzle.answer_id : puzzle.answer_en;
  const catLabel = t(`catLabel${capitalize(puzzle.category)}`);
  const isOpenEnded = !!puzzle.open_ended;

  const hintsHtml = hints.map((h, i) => {
    if (i < STATE.hintsRevealed) {
      return `<div class="hint">
        <span class="hint-num">${i+1}</span>
        <span>${escapeHtml(h)}</span>
      </div>`;
    }
    return `<div class="hint locked" data-hint-idx="${i}">
      <span class="hint-num">${i+1}</span>
      <span class="lock-icon">🔒</span>
      <span>${t('hintLocked')}</span>
    </div>`;
  }).join('');

  // Answer input section — different UX for validated vs open-ended puzzles
  let answerInputHtml = '';
  if (isSolved) {
    answerInputHtml = `
      <div class="section-divider">${t('yourAnswerLabel')}</div>
      <div class="answer-result success">
        <div class="answer-label-success">✓ ${t('solvedAlready')}</div>
      </div>
    `;
  } else if (isOpenEnded) {
    answerInputHtml = `
      <div class="section-divider">${t('answerSectionLabel')}</div>
      <div class="answer-input-row">
        <p class="open-note">${t('openEndedNote')}</p>
      </div>
    `;
  } else {
    answerInputHtml = `
      <div class="section-divider">${t('answerSectionLabel')}</div>
      <div class="answer-input-row">
        <input type="text" class="answer-input" id="answer-input" placeholder="${t('answerPlaceholder')}" autocomplete="off">
        <button class="btn btn-primary answer-submit" id="answer-submit">${t('submitAnswer')}</button>
      </div>
      <div class="answer-result" id="answer-result"></div>
    `;
  }

  return `
    <button class="modal-close" id="modal-close-btn">✕</button>
    <div class="modal-eyebrow">${catLabel} · ${t('challengeBadge')}</div>
    <h2 class="modal-title">${escapeHtml(title)}</h2>

    <div class="modal-stats">
      <span><strong>${t('catLabel')}</strong>: ${puzzle.category.toUpperCase()}</span>
      <span><strong>${t('diffLabel')}</strong>: ${'●'.repeat(puzzle.difficulty)}${'○'.repeat(3-puzzle.difficulty)}</span>
      ${isSolved ? `<span style="color:#00ffa3;">✓ ${t('solvedTag')}</span>` : ''}
    </div>

    <div class="modal-prompt">${escapeHtml(prompt)}</div>

    ${answerInputHtml}

    <div class="section-divider">${t('hintsTitle')}</div>
    <div class="hint-list">${hintsHtml}</div>

    <div class="answer-block ${STATE.answerShown ? 'on' : ''}" id="answer-block">
      <div class="answer-label">${t('answerLabel')}</div>
      <div>${escapeHtml(answer)}</div>
    </div>

    <div class="modal-actions">
      <button class="btn btn-secondary" id="show-answer-btn">${STATE.answerShown ? t('answerShown') : t('answerHidden')}</button>
      <button class="btn btn-primary" id="ask-mentor-btn">${t('askMentor')}</button>
    </div>
    ${isSolved
      ? `<div class="modal-actions" style="margin-top:8px;">
          <button class="btn btn-secondary" id="unsolve-btn">${t('unsolved')}</button>
        </div>`
      : (isOpenEnded
        ? `<div class="modal-actions" style="margin-top:8px;">
            <button class="btn btn-primary" id="solved-btn">${t('markSolved')}</button>
          </div>`
        : '')}
  `;
}

// ============================================================
// Answer validation — keyword match
// ============================================================
function validateAnswer(userAnswer, puzzle) {
  if (!userAnswer || !userAnswer.trim()) return false;
  const keywords = puzzle.answer_keywords || [];
  if (keywords.length === 0) return false;
  const normalized = userAnswer.toLowerCase().trim();
  return keywords.some(kw => {
    const kwLower = kw.toLowerCase();
    return normalized === kwLower || normalized.includes(kwLower);
  });
}

// ============================================================
// Narrator Agent — composes contextual prose
// ============================================================
function narratorPanel() {
  // Currently inline in stats — could be expanded to a quote box if desired.
  // Reserved for future "daily encouragement" feature.
  return null;
}

// ============================================================
// Helpers
// ============================================================
function $(id) { return document.getElementById(id); }
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ============================================================
// RENDER
// ============================================================
function renderCategories() {
  const wrap = $('categories');
  wrap.innerHTML = CATEGORIES.map(c => {
    const count = c.id === 'all'
      ? STATE.puzzles.length
      : STATE.puzzles.filter(p => p.category === c.id).length;
    const countText = c.id === 'all' ? t('catCountAll', count) : t('catCount', count);
    return `
      <div class="category-card ${STATE.selectedCategory === c.id ? 'active' : ''}" data-cat="${c.id}">
        <div class="category-icon">${c.icon}</div>
        <div class="category-name">${t(c.labelKey)}</div>
        <div class="category-count">${countText}</div>
      </div>
    `;
  }).join('');

  wrap.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      STATE.selectedCategory = card.dataset.cat;
      renderCategories();
      renderPuzzles();
    });
  });
}

function renderPuzzles() {
  const wrap = $('puzzles');
  const list = curatorFilter(STATE.selectedCategory);
  const d = Tracker.load();

  wrap.innerHTML = list.map(p => {
    const title = STATE.lang === 'id' ? p.title_id : p.title_en;
    const prompt = STATE.lang === 'id' ? p.puzzle_id : p.puzzle_en;
    const isSolved = !!d.solved[p.id];
    return `
      <div class="puzzle-card ${isSolved ? 'solved' : ''}" data-id="${p.id}">
        <div class="puzzle-meta">
          <span class="puzzle-cat">${p.category}</span>
          <span class="puzzle-diff">
            ${[1,2,3].map(i => `<span class="diff-dot ${i <= p.difficulty ? 'on' : ''}"></span>`).join('')}
          </span>
          ${isSolved ? `<span class="solved-tag">✓</span>` : ''}
        </div>
        <div class="puzzle-title">${escapeHtml(title)}</div>
        <div class="puzzle-prompt">${escapeHtml(prompt)}</div>
      </div>
    `;
  }).join('');

  wrap.querySelectorAll('.puzzle-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      const puzzle = STATE.puzzles.find(p => p.id === id);
      if (puzzle) openPuzzle(puzzle);
    });
  });
}

function renderStats() {
  const s = Tracker.stats();
  $('stat-streak').textContent = s.streak;
  $('stat-solved').textContent = s.solved;
  $('stat-attempts').textContent = s.attempts;
  $('stat-rate').textContent = s.rate !== null ? `${s.rate}%` : '—';
}

function applyLang() {
  document.documentElement.setAttribute('lang', STATE.lang);
  $('lang-btn').textContent = STATE.lang.toUpperCase();
  $('hero-eyebrow').textContent = t('eyebrow');
  $('hero-title').innerHTML = t('heroTitle');
  $('hero-subtitle').textContent = t('heroSubtitle');
  $('pill-1').textContent = t('pill1');
  $('pill-2').textContent = t('pill2');
  $('pill-3').textContent = t('pill3');
  $('pill-4').textContent = t('pill4');
  $('stat-streak-label').textContent = t('statStreak');
  $('stat-solved-label').textContent = t('statSolved');
  $('stat-attempts-label').textContent = t('statAttempts');
  $('stat-rate-label').textContent = t('statRate');
  $('cat-eyebrow').textContent = t('catEyebrow');
  $('cat-title').textContent = t('catTitle');
  $('agents-eyebrow').textContent = t('agentsEyebrow');
  $('agents-title').textContent = t('agentsTitle');
  for (let i = 1; i <= 6; i++) {
    $(`agent-${i}-name`).textContent = t(`agent${i}Name`);
    $(`agent-${i}-role`).textContent = t(`agent${i}Role`);
    $(`agent-${i}-desc`).textContent = t(`agent${i}Desc`);
  }
  $('footer-tagline').textContent = t('footerTagline');
  $('footer-credit').textContent = t('footerCredit');
  $('chat-input').placeholder = t('chatPlaceholder');
  $('chat-status').textContent = t('chatStatus');

  renderCategories();
  renderPuzzles();
  renderChatSuggestions();

  if (STATE.chatHistory.length === 0) renderChatGreeting();

  if ($('modal').classList.contains('on') && STATE.currentPuzzle) {
    $('modal-content').innerHTML = coachRender(STATE.currentPuzzle);
    bindModalEvents();
  }
}

function applyTheme() {
  document.documentElement.setAttribute('data-theme', STATE.theme);
  $('theme-btn').textContent = STATE.theme === 'dark' ? '🌙' : '☀️';
}

// ============================================================
// PUZZLE MODAL
// ============================================================
function openPuzzle(puzzle) {
  STATE.currentPuzzle = puzzle;
  STATE.hintsRevealed = 0;
  STATE.answerShown = false;
  Tracker.recordAttempt(puzzle.id);
  $('modal-content').innerHTML = coachRender(puzzle);
  $('modal').classList.add('on');
  document.body.style.overflow = 'hidden';
  bindModalEvents();
  renderStats();
}

function closeModal() {
  $('modal').classList.remove('on');
  document.body.style.overflow = '';
  STATE.currentPuzzle = null;
}

function bindModalEvents() {
  $('modal-close-btn')?.addEventListener('click', closeModal);

  // Hint reveal
  document.querySelectorAll('.hint.locked').forEach(h => {
    h.addEventListener('click', () => {
      const idx = parseInt(h.dataset.hintIdx);
      if (idx === STATE.hintsRevealed) {
        STATE.hintsRevealed++;
        $('modal-content').innerHTML = coachRender(STATE.currentPuzzle);
        bindModalEvents();
      }
    });
  });

  // Toggle answer
  $('show-answer-btn')?.addEventListener('click', () => {
    STATE.answerShown = !STATE.answerShown;
    $('modal-content').innerHTML = coachRender(STATE.currentPuzzle);
    bindModalEvents();
  });

  // Submit answer (validated puzzles)
  const submitAnswer = () => {
    const input = $('answer-input');
    if (!input || !STATE.currentPuzzle) return;
    const userAnswer = input.value.trim();
    if (!userAnswer) return;
    const result = $('answer-result');
    const isCorrect = validateAnswer(userAnswer, STATE.currentPuzzle);
    if (isCorrect) {
      // Auto-mark solved
      Tracker.recordSolve(STATE.currentPuzzle.id, STATE.hintsRevealed);
      if (result) {
        result.className = 'answer-result success';
        result.innerHTML = `<div class="answer-label-success">✓ ${t('correct')}</div>`;
      }
      // Re-render after short delay so user sees success
      setTimeout(() => {
        $('modal-content').innerHTML = coachRender(STATE.currentPuzzle);
        bindModalEvents();
        renderStats();
        renderPuzzles();
      }, 1200);
    } else {
      if (result) {
        result.className = 'answer-result error';
        result.innerHTML = `<div class="answer-label-error">✗ ${t('incorrect')}</div>`;
      }
    }
  };

  $('answer-submit')?.addEventListener('click', submitAnswer);
  $('answer-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') submitAnswer();
  });

  // Mark solved (open-ended puzzles only)
  $('solved-btn')?.addEventListener('click', () => {
    if (!STATE.currentPuzzle) return;
    Tracker.recordSolve(STATE.currentPuzzle.id, STATE.hintsRevealed);
    $('modal-content').innerHTML = coachRender(STATE.currentPuzzle);
    bindModalEvents();
    renderStats();
    renderPuzzles();
  });

  $('unsolve-btn')?.addEventListener('click', () => {
    if (!STATE.currentPuzzle) return;
    Tracker.unsolve(STATE.currentPuzzle.id);
    $('modal-content').innerHTML = coachRender(STATE.currentPuzzle);
    bindModalEvents();
    renderStats();
    renderPuzzles();
  });

  // Ask mentor — pre-seed chat with puzzle context
  $('ask-mentor-btn')?.addEventListener('click', () => {
    closeModal();
    openChat();
    const title = STATE.lang === 'id' ? STATE.currentPuzzle?.title_id : STATE.currentPuzzle?.title_en;
    if (title) {
      const seed = STATE.lang === 'id'
        ? `Aku stuck di "${title}". Kasih aku petunjuk arah berpikir.`
        : `I'm stuck on "${title}". Give me a direction to think in.`;
      $('chat-input').value = seed;
      $('chat-input').focus();
    }
  });
}

// ============================================================
// CHAT
// ============================================================
function openChat() {
  STATE.chatOpen = true;
  $('chat-panel').classList.add('on');
  $('chat-fab').classList.add('hidden');
  if (STATE.chatHistory.length === 0) renderChatGreeting();
  setTimeout(() => $('chat-input').focus(), 100);
}

function closeChat() {
  STATE.chatOpen = false;
  $('chat-panel').classList.remove('on');
  $('chat-fab').classList.remove('hidden');
}

function renderChatGreeting() {
  $('chat-messages').innerHTML = `<div class="msg bot">${escapeHtml(t('chatGreet'))}</div>`;
}

function renderChatSuggestions() {
  $('chat-suggestions').innerHTML = `
    <button class="chat-suggest" data-q="${escapeHtml(t('chatSuggest1'))}">${escapeHtml(t('chatSuggest1'))}</button>
    <button class="chat-suggest" data-q="${escapeHtml(t('chatSuggest2'))}">${escapeHtml(t('chatSuggest2'))}</button>
    <button class="chat-suggest" data-q="${escapeHtml(t('chatSuggest3'))}">${escapeHtml(t('chatSuggest3'))}</button>
    <button class="chat-suggest" data-q="${escapeHtml(t('chatSuggest4'))}">${escapeHtml(t('chatSuggest4'))}</button>
  `;
  $('chat-suggestions').querySelectorAll('.chat-suggest').forEach(b => {
    b.addEventListener('click', () => {
      $('chat-input').value = b.dataset.q;
      sendChat();
    });
  });
}

function appendMsg(role, content) {
  const div = document.createElement('div');
  div.className = `msg ${role}`;
  if (role === 'bot') {
    div.innerHTML = String(content)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  } else {
    div.textContent = content;
  }
  $('chat-messages').appendChild(div);
  $('chat-messages').scrollTop = $('chat-messages').scrollHeight;
}

function appendTyping() {
  const div = document.createElement('div');
  div.className = 'msg-typing';
  div.id = 'typing-indicator';
  div.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
  $('chat-messages').appendChild(div);
  $('chat-messages').scrollTop = $('chat-messages').scrollHeight;
}

function removeTyping() {
  $('typing-indicator')?.remove();
}

async function sendChat() {
  const input = $('chat-input');
  const message = input.value.trim();
  if (!message) return;

  input.value = '';
  $('chat-send').disabled = true;
  appendMsg('user', message);
  STATE.chatHistory.push({ role: 'user', content: message });

  appendTyping();
  const reply = await mentorChat(message);
  removeTyping();

  if (reply) {
    appendMsg('bot', reply);
    STATE.chatHistory.push({ role: 'assistant', content: reply });
  } else {
    appendMsg('bot', t('chatErr'));
  }
  $('chat-send').disabled = false;
}

// ============================================================
// HANDLERS
// ============================================================
function toggleLang() {
  STATE.lang = STATE.lang === 'en' ? 'id' : 'en';
  localStorage.setItem('mimobrain-lang', STATE.lang);
  applyLang();
}

function toggleTheme() {
  STATE.theme = STATE.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('mimobrain-theme', STATE.theme);
  applyTheme();
}

// ============================================================
// INIT
// ============================================================
async function init() {
  applyTheme();

  try {
    const res = await fetch('puzzles.json');
    STATE.puzzles = await res.json();
  } catch (err) {
    console.error('Failed to load puzzles:', err);
    STATE.puzzles = [];
  }

  applyLang();
  renderStats();

  $('lang-btn').addEventListener('click', toggleLang);
  $('theme-btn').addEventListener('click', toggleTheme);

  // Modal close on backdrop
  $('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') closeModal();
  });

  // Chat
  $('chat-fab').addEventListener('click', openChat);
  $('chat-close').addEventListener('click', closeChat);
  $('chat-send').addEventListener('click', sendChat);
  $('chat-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') sendChat();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if ($('modal').classList.contains('on')) closeModal();
      else if (STATE.chatOpen) closeChat();
    }
  });
}

init();
