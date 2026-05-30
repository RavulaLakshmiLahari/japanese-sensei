// ─── PASTE YOUR GROQ KEY HERE ──────────────────────────



const GROQ_KEY = "YOUR_GROQ_API_KEY_HERE";

// ─── LEVEL & TOPIC DATA ───────────────────────────────────
const LEVELS = {
  N5: {
    label: "N5 Beginner",
    topics: [
      "Hiragana (あいうえお)", "Katakana (アイウエオ)",
      "Numbers & Counting", "Basic Greetings",
      "Colors & Adjectives", "Days & Time",
      "Particles: は, が, を, に", "て-form verbs",
      "Basic Sentence Structure", "Family Vocabulary"
    ]
  },
  N4: {
    label: "N4 Elementary",
    topics: [
      "Verb Conjugation", "て-form & ている",
      "Potential Form (できる)", "Casual vs Formal Speech",
      "Giving & Receiving (あげる/もらう)", "Conditionals: たら, なら",
      "Counters & Classifiers", "Basic Kanji (80 chars)",
      "Direction & Location", "て-form Requests"
    ]
  },
  N3: {
    label: "N3 Intermediate",
    topics: [
      "N3 Grammar Patterns", "Complex Particles",
      "Passive & Causative Forms", "Conditional Expressions",
      "Keigo (Polite Speech) Intro", "300 Essential Kanji",
      "Reading Simple Texts", "Expressing Emotions",
      "Compound Verbs", "Nominalizing with こと & の"
    ]
  },
  N2: {
    label: "N2 Upper Intermediate",
    topics: [
      "Advanced Keigo", "Literary Grammar Patterns",
      "1000 Kanji Reading", "Complex Conditionals",
      "Idiomatic Expressions", "Relative Clauses",
      "Advanced Particles", "Formal Written Japanese",
      "JLPT N2 Grammar Drills", "Nuance & Register"
    ]
  },
  N1: {
    label: "N1 Advanced",
    topics: [
      "Classical Japanese Roots", "Rare Grammar Patterns",
      "2000 Kanji Mastery", "Business Japanese",
      "Abstract Vocabulary", "Literary Reading",
      "Dialects & Slang", "Advanced Nuance",
      "Formal Writing Styles", "JLPT N1 Pattern Drills"
    ]
  }
};

// ─── STATE ────────────────────────────────────────────────
let history      = [];
let currentLevel = "N5";
let inQuizMode   = false;
let correctCount = 0;
let wrongCount   = 0;
let msgCount     = 0;
let streakDays   = 0;

// ─── SYSTEM PROMPT ────────────────────────────────────────
function getSystemPrompt() {
  return `You are a warm, encouraging Japanese language tutor named Sensei.
You teach Japanese to English speakers using clear, structured methods.

CURRENT STUDENT LEVEL: ${currentLevel} (${LEVELS[currentLevel].label})

FORMATTING RULES:
- Show Japanese text like this:
    日本語 (にほんご / Nihongo) = "Japanese language"
  Format: kanji → (furigana / romaji) → English meaning
- Use ✅ for correct answers, ❌ for wrong answers
- Use mnemonic devices to help remember characters
- Give cultural context where helpful

LESSON MODE (when asked to teach a topic):
  1. Introduction — what it is and why it matters
  2. Core concept — 3 to 5 clear examples
  3. Memory tricks — mnemonics
  4. Practice sentences — 2 real examples
  5. Cultural note — one interesting fact
  6. Self-check — one quick question

QUIZ MODE (when asked for a quiz):
- Generate exactly 5 multiple choice questions at ${currentLevel} difficulty
- Number Q1 through Q5, give 4 options: A, B, C, D
- Do NOT reveal answers — wait for the student to reply
- When grading: say ✅ Correct! or ❌ Wrong. The answer was [X].
- After all 5: give total score like "You got 4/5! 頑張って！"

Answer any Japanese or cultural question the student asks.`;
}

// ─── GROQ API CALL ────────────────────────────────────────
async function callClaude(userMessage) {

  // Build messages array with system prompt first
  const messages = [
    { role: "system", content: getSystemPrompt() },
    ...history,
    { role: "user", content: userMessage }
  ];

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_KEY}`
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",   // free, powerful model
      max_tokens: 1000,
      temperature: 0.7,
      messages: messages
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || "API error " + response.status);
  }

  const data  = await response.json();
  const reply = data.choices[0].message.content;

  // Save both turns to history
  history.push({ role: "user",      content: userMessage });
  history.push({ role: "assistant", content: reply });

  // Keep last 24 messages to avoid token limit
  if (history.length > 30) history = history.slice(-24);

  return reply;
}

// ─── UI HELPERS ───────────────────────────────────────────
function addMsg(role, text, type = "normal") {
  const area = document.getElementById("chat-area");
  const div  = document.createElement("div");

  if (type === "system") {
    div.className = "msg";
    div.innerHTML = `<div class="bubble system">${text}</div>`;
  } else if (role === "user") {
    div.className = "msg user";
    div.innerHTML = `
      <div class="avatar usr">You</div>
      <div class="bubble">${text}</div>`;
  } else {
    const cls = type === "quiz"  ? "bubble quiz"
              : type === "error" ? "bubble error"
              : "bubble";
    div.className = "msg ai";
    div.innerHTML = `
      <div class="avatar ai">先</div>
      <div class="${cls}">${text}</div>`;
  }

  area.appendChild(div);
  area.scrollTop = area.scrollHeight;
}

function addLoading() {
  const area = document.getElementById("chat-area");
  const div  = document.createElement("div");
  div.id = "loading-msg";
  div.className = "msg ai";
  div.innerHTML = `
    <div class="avatar ai">先</div>
    <div class="loading">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>`;
  area.appendChild(div);
  area.scrollTop = area.scrollHeight;
}

function removeLoading() {
  const el = document.getElementById("loading-msg");
  if (el) el.remove();
}

function updateStats() {
  document.getElementById("correct-count").textContent = correctCount;
  document.getElementById("wrong-count").textContent   = wrongCount;
  document.getElementById("msg-count").textContent     = msgCount;
}

// ─── LESSON MODE ──────────────────────────────────────────
async function startLesson() {
  const topic = document.getElementById("topic-select").value;
  inQuizMode  = false;

  addMsg("ai", `📚 Starting lesson: <b>${topic}</b>`, "system");
  addLoading();

  try {
    const reply = await callClaude(
      `Teach me about "${topic}" for ${currentLevel} level. ` +
      `Give me a full structured lesson with examples, mnemonics, and practice sentences.`
    );
    removeLoading();
    addMsg("ai", reply);
    msgCount++;
    updateStats();
  } catch (err) {
    removeLoading();
    addMsg("ai", "⚠️ " + err.message, "error");
    console.error(err);
  }
}

// ─── QUIZ MODE ────────────────────────────────────────────
async function startQuiz() {
  const topic = document.getElementById("topic-select").value;
  inQuizMode  = true;

  addMsg("ai", `📝 Quiz started: <b>${topic}</b>`, "system");
  addLoading();

  try {
    const reply = await callClaude(
      `Create a 5-question multiple choice quiz about "${topic}" ` +
      `for ${currentLevel} level. Number Q1–Q5, give 4 options each (A B C D). ` +
      `Do NOT reveal answers — list all 5 questions and wait for me to answer.`
    );
    removeLoading();
    addMsg("ai", reply, "quiz");
    msgCount++;
    updateStats();
  } catch (err) {
    removeLoading();
    addMsg("ai", "⚠️ " + err.message, "error");
    console.error(err);
  }
}

// ─── SEND MESSAGE ─────────────────────────────────────────
async function sendMessage() {
  const input = document.getElementById("user-input");
  const text  = input.value.trim();
  if (!text) return;

  input.value = "";
  addMsg("user", text);
  addLoading();
  msgCount++;

  const quizHint = inQuizMode
    ? " [Grade my answer: say ✅ or ❌ with a brief explanation. " +
      "If all 5 questions are answered, give total score out of 5.]"
    : "";

  try {
    const reply = await callClaude(text + quizHint);
    removeLoading();

    if (inQuizMode) {
      correctCount += (reply.match(/✅/g) || []).length;
      wrongCount   += (reply.match(/❌/g) || []).length;
    }

    addMsg("ai", reply, inQuizMode ? "quiz" : "normal");
    updateStats();

    if (reply.includes("/5")) {
      streakDays++;
      document.getElementById("streak-badge").textContent =
        `🔥 ${streakDays} day streak`;
    }
  } catch (err) {
    removeLoading();
    addMsg("ai", "⚠️ " + err.message, "error");
    console.error(err);
  }
}

// Enter = send, Shift+Enter = newline
document.getElementById("user-input").addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// ─── LEVEL & TOPIC MANAGEMENT ─────────────────────────────
function changeLevel() {
  currentLevel = document.getElementById("level-select").value;
  document.getElementById("level-badge").textContent = LEVELS[currentLevel].label;
  populateTopics();
}

function populateTopics() {
  const sel = document.getElementById("topic-select");
  sel.innerHTML = LEVELS[currentLevel].topics
    .map(t => `<option value="${t}">${t}</option>`)
    .join("");
}

function resetChat() {
  history = [];
  inQuizMode = false;
  correctCount = 0;
  wrongCount   = 0;
  msgCount     = 0;
  document.getElementById("chat-area").innerHTML = `
    <div class="msg ai">
      <div class="avatar ai">先</div>
      <div class="bubble">Chat reset! 新しいスタート (Fresh start)! 🎌
Select a topic above and click Start Lesson, or just ask me anything.</div>
    </div>`;
  updateStats();
}

// ─── INIT ─────────────────────────────────────────────────
populateTopics();

document.getElementById("chat-area").innerHTML = `
  <div class="msg ai">
    <div class="avatar ai">先</div>
    <div class="bubble">こんにちは！Welcome to Japanese Sensei! 🎌

I'm your personal Japanese tutor. Here's how to use me:

📚 Start Lesson — I'll teach any topic with examples & mnemonics
📝 Quiz Me — Test your knowledge with multiple choice questions
💬 Free chat — Ask me anything in English or Japanese

Select your level (N5–N1) and topic above, then click a button to begin!
始めましょう！(Let's begin!)</div>
  </div>`;
