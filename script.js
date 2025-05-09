// === AI Assistant ===
async function askAI() {
  const prompt = document.getElementById("question").value;
  try {
    const res = await fetch("http://localhost:5000/api/openai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    document.getElementById("response").innerText = data.reply;
  } catch (error) {
    console.error(error);
    document.getElementById("response").innerText = "Something went wrong.";
  }
}

// === Flashcards ===
function saveFlashcard() {
  const question = document.getElementById("question").value.trim();
  const answer = document.getElementById("response").innerText.trim();

  if (!question || !answer) return;

  const card = document.createElement("div");
  card.className = "flashcard";
  card.innerHTML = `<h3>Q: ${question}</h3><p>A: ${answer}</p>`;
  document.getElementById("flashcards").appendChild(card);
}

function exportFlashcardsToPDF() {
  const flashcards = document.getElementById("flashcards");
  if (!flashcards || flashcards.innerHTML.trim() === "") {
    alert("No flashcards to export.");
    return;
  }

  const opt = {
    margin: 0.5,
    filename: "flashcards.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };

  html2pdf().set(opt).from(flashcards).save();
}

// === To-Do List ===
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
  removeBtn.onclick = function() {
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
  document.querySelectorAll("#todo-list li").forEach(li => {
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
  todos.forEach(todo => {
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
    removeBtn.onclick = function() {
      li.remove();
      saveTodos();
    };

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(removeBtn);
    document.getElementById("todo-list").appendChild(li);
  });
}


// === Dark Mode ===
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
}

window.onload = () => {
  loadTodos();
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
  }
};


  
  