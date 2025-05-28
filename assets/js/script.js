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
  const question = shuffled.find(q => q !== lastQuestion);
  lastQuestion = question;
  return question || "No more unique questions.";
}

function displayQuestion(text) {
  const display = document.getElementById("questionDisplay");
  display.textContent = text;
}

function showQuestionView(category) {
  activeCategory = category;
  document.getElementById("categoryView").classList.add("hidden");
  document.getElementById("questionView").classList.remove("hidden");
  document.getElementById("rules").classList.add("hidden");
  displayQuestion(getRandomQuestionFromCategory(category));
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
      displayQuestion(question);
    }
  });

  document.getElementById("backBtn").addEventListener("click", showCategoryView);
}

document.addEventListener("DOMContentLoaded", () => {
  loadQuestions(main);
});
