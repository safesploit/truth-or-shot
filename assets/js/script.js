// Global configuration
const SHOW_THEME = true; // Toggle true/false show/hide theme of question

let QUESTIONS = {};
let activeCategory = null;
let lastQuestion = null;

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getRandomQuestionFromCategory(category) {
  const pool = QUESTIONS[category] || [];
  const shuffled = shuffle(pool);
  const entry = shuffled.find(q => q.text !== lastQuestion);
  if (!entry) return null;

  lastQuestion = entry.text;
  return entry;
}

function displayQuestion(text, theme = "") {
  const display = document.getElementById("questionDisplay");
  display.innerHTML = `
    <div class="question-text">${text}</div>
    ${SHOW_THEME && theme ? `<div class="question-theme">(${theme})</div>` : ""}
  `;
}

function showQuestionView(category) {
  activeCategory = category;
  document.getElementById("categoryView").classList.add("hidden");
  document.getElementById("questionView").classList.remove("hidden");
  document.getElementById("rules").classList.add("hidden");

  const question = getRandomQuestionFromCategory(category);
  if (question) {
    displayQuestion(question.text, question.theme);
  } else {
    displayQuestion("No more unique questions.");
  }
}

function showCategoryView() {
  activeCategory = null;
  document.getElementById("categoryView").classList.remove("hidden");
  document.getElementById("questionView").classList.add("hidden");
  document.getElementById("rules").classList.remove("hidden");
}

function addCategoryIcons() {
  const icons = {
    general: "🌐",
    friends: "👯",
    couple: "💞",
    party: "🎉",
    nsfw: "🔞"
  };

  document.querySelectorAll("button[data-category]").forEach(button => {
    const cat = button.getAttribute("data-category");
    const label = cat.charAt(0).toUpperCase() + cat.slice(1);
    button.innerHTML = `${icons[cat] || ""} ${label}`;
  });
}

function loadQuestions(callback) {
  fetch("assets/js/questions.yaml")
    .then(res => res.text())
    .then(yamlText => {
      QUESTIONS = jsyaml.load(yamlText);
      callback();
    })
    .catch(err => {
      console.error("Failed to load questions.yaml:", err);
      displayQuestion("Error loading questions.");
    });
}

function main() {
  addCategoryIcons();

  document.querySelectorAll("button[data-category]").forEach(button => {
    button.addEventListener("click", () => {
      const category = button.getAttribute("data-category");
      showQuestionView(category);
    });
  });

  document.getElementById("nextBtn").addEventListener("click", () => {
    if (activeCategory) {
      const question = getRandomQuestionFromCategory(activeCategory);
      if (question) {
        displayQuestion(question.text, question.theme);
      } else {
        displayQuestion("No more unique questions.");
      }
    }
  });

  document.getElementById("backBtn").addEventListener("click", showCategoryView);
}

document.addEventListener("DOMContentLoaded", () => {
  loadQuestions(main);
});
