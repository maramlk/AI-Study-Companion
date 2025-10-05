/* =========================================================
   🤖 AI Study Companion - Script.js
   Handles: AI Assistant, Flashcards, To-Do List, Dark Mode
========================================================= */

// === AI Assistant ===
async function askAI() {
  const prompt = document.getElementById("question").value.trim();
  const responseBox = document.getElementById("response");

  if (!prompt) {
    responseBox.innerText = "Please enter a question first.";
    return;
  }

  responseBox.innerText = "🤖 Thinking...";
  try {
    const res = await fetch("http://localhost:5000/api/openai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    responseBox.innerText = data.reply;
  } catch (error) {
    console.error(error);
    responseBox.innerText = "❌ Something went wrong while contacting the AI.";
  }
}

/* =========================================================
   📚 Flashcards
========================================================= */
function saveFlashcard() {
  const question = document.getElementById("question").value.trim();
  const answer = document.getElementById("response").innerText.trim();

  if (!question || !answer || answer === "🤖 Thinking...") {
    alert("Please enter a question and wait for the AI response before saving.");
    return;
  }

  // Create new flashcard element
  const card = document.createElement("div");
  card.className = "flashcard";
  card.innerHTML = `<h3>Q: ${question}</h3><p>A: ${answer}</p>`;

  document.getElementById("flashcards").appendChild(card);

  // Save to localStorage
  const existing = JSON.parse(localStorage.getItem("flashcards") || "[]");
  existing.push({ question, answer });
  localStorage.setItem("flashcards", JSON.stringify(existing));
}

function loadFlashcards() {
  const saved = JSON.parse(localStorage.getItem("flashcards") || "[]");
  const container = document.getElementById("flashcards");
  container.innerHTML = "";

  saved.forEach((card) => {
    const div = document.createElement("div");
    div.className = "flashcard";
    div.innerHTML = `<h3>Q: ${card.question}</h3><p>A: ${card.answer}</p>`;
    container.appendChild(div);
  });
}

function exportFlashcardsToPDF() {
  const flashcards = document.getElementById("flashcards");
  if (!flashcards || flashcards.innerHTML.trim() === "") {
    alert("No flashcards to export.");
    return;
  }

  // Create PDF title
  const pdfContainer = document.createElement("div");
  const title = document.createElement("h1");
  title.id = "pdf-title";
  title.textContent = "📘 Study Flashcards - AI Study Companion";
  pdfContainer.appendChild(title);

  // Clone flashcards to prevent layout shifts
  const clonedCards = flashcards.cloneNode(true);
  pdfContainer.appendChild(clonedCards);

  const opt = {
    margin: 0.5,
    filename: "Flashcards_Study_Set.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, backgroundColor: "#ffffff" },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] },
  };

  html2pdf().set(opt).from(pdfContainer).save();
}

/* =========================================================
   📝 To-Do List
========================================================= */
function addTodo() {
  const input = document.getElementById("todo-input");
  const task = input.value.trim();
  if (!task) return;

  const li = document.createElement("li");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.onclick = saveTodos;

  const span = document.createElement("span");
  span.textContent = task;

  const removeBtn = document.createElement("button");
  removeBtn.innerHTML = "❌";
  removeBtn.className = "remove-todo";
  removeBtn.onclick = function () {
    li.remove();
    saveTodos();
  };

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(removeBtn);
  document.getElementById("todo-list").appendChild(li);

  input.value = "";
  saveTodos();
}

function saveTodos() {
  const todos = [];
  document.querySelectorAll("#todo-list li").forEach((li) => {
    const text = li.querySelector("span").textContent;
    const checked = li.querySelector("input").checked;
    todos.push({ text, checked });
  });
  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos() {
  const saved = localStorage.getItem("todos");
  if (!saved) return;

  const todos = JSON.parse(saved);
  todos.forEach((todo) => {
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.checked;
    checkbox.onclick = saveTodos;

    const span = document.createElement("span");
    span.textContent = todo.text;

    const removeBtn = document.createElement("button");
    removeBtn.innerHTML = "❌";
    removeBtn.className = "remove-todo";
    removeBtn.onclick = function () {
      li.remove();
      saveTodos();
    };

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(removeBtn);
    document.getElementById("todo-list").appendChild(li);
  });
}

/* =========================================================
   🌙 Dark Mode
========================================================= */
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
}

/* =========================================================
   🚀 Initialization
========================================================= */
window.onload = () => {
  loadTodos();
  loadFlashcards();
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
  }
};
