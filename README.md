# 🇯🇵 Japanese Sensei

An AI-powered Japanese language learning web app — from complete beginner (N5) to advanced (N1).  
Built with pure HTML, CSS, and JavaScript. No frameworks. No installation. Just open and learn.

---

## 🌐 Live Demo

👉 [Click here to open the app](https://RavulaLakshmiLahari.github.io/japanese-sensei)

---

## ✨ Features

- 📚 **Structured Lessons** — Every topic taught with examples, furigana, romaji, mnemonics, and cultural notes
- 📝 **Auto-graded Quizzes** — 5 multiple choice questions per topic with instant ✅ / ❌ feedback and score
- 💬 **Free Chat** — Ask your AI tutor anything in English or Japanese
- 🎌 **5 JLPT Levels** — N5 (beginner) → N4 → N3 → N2 → N1 (advanced)
- 🔥 **Streak Tracker** — Tracks your daily practice streak
- 📊 **Score Counter** — Live correct / wrong answer tracking

---

## 📚 Topics Covered

| Level | Topics |
|-------|--------|
| **N5** Beginner | Hiragana, Katakana, Numbers, Greetings, Colors, Days & Time, Particles, Verb basics |
| **N4** Elementary | Verb conjugation, て-form, Potential form, Casual vs Formal, Conditionals, Kanji 80 |
| **N3** Intermediate | Grammar patterns, Passive & Causative, Keigo intro, 300 Kanji, Compound verbs |
| **N2** Upper Intermediate | Advanced Keigo, Literary grammar, 1000 Kanji, Idiomatic expressions |
| **N1** Advanced | Classical Japanese, 2000 Kanji, Business Japanese, JLPT N1 patterns |

---

## 🚀 How to Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/RavulaLakshmiLahari/japanese-sensei.git
cd japanese-sensei
```

### 2. Get a free Groq API key
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up free (no credit card needed)
3. Click **API Keys** → **Create API Key**
4. Copy the key (starts with `gsk_...`)

### 3. Add your API key
Open `app.js` and replace line 1:
```javascript
const GROQ_KEY = "YOUR_GROQ_API_KEY_HERE";
```
With your actual key:
```javascript
const GROQ_KEY = "gsk_your_actual_key_here";
```

### 4. Open the app
Just double-click `index.html` — no server or install needed.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Structure |
| CSS3 | Styling & animations |
| Vanilla JavaScript | App logic & API calls |
| [Groq API](https://console.groq.com) | AI responses (free) |
| LLaMA 3.3 70B | Language model |
| GitHub Pages | Free hosting |

---
## 📁 Project Structure
japanese-sensei/
├── index.html      # App structure & layout
├── style.css       # All styling & animations
├── app.js          # All logic, API calls, quiz system
└── README.md       # This file
---

## 🔒 Security Note

> ⚠️ Never upload your real API key to GitHub.  
> The `app.js` in this repo uses a placeholder `YOUR_GROQ_API_KEY_HERE`.  
> Each user should add their own free key from [console.groq.com](https://console.groq.com).

---

## 📖 How to Use

1. **Select your level** — Choose N5 (beginner) to N1 (advanced)
2. **Select a topic** — Pick from the dropdown menu
3. **Start Lesson** — Get a full structured lesson with examples
4. **Quiz Me** — Answer 5 multiple choice questions
5. **Free Chat** — Type any question and your AI tutor will answer

---

## 🤝 Contributing

Pull requests are welcome! To contribute:

```bash
# Fork the repo, then:
git clone https://github.com/YOUR_USERNAME/japanese-sensei.git
cd japanese-sensei

# Make your changes, then:
git add .
git commit -m "describe your change"
git push
```

---

## 📄 License

This project is open source under the [MIT License](LICENSE).

---

## 👩‍💻 Author

**Ravula Lakshmi Lahari**  
GitHub: [@RavulaLakshmiLahari](https://github.com/RavulaLakshmiLahari)

---

⭐ If you found this helpful, please give it a star on GitHub!
