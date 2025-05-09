let questions = [];

function addQuestion() {
  const questionInput = document.getElementById("question-input");
  const answerInput = document.getElementById("answer-input");
  const questionText = questionInput.value.trim();
  const answerText = answerInput.value.trim();

  if (!questionText || !answerText) {
    alert("Please enter both a question and an answer.");
    return;
  }

  questions.push({ question: questionText, answer: answerText });
  questionInput.value = "";
  answerInput.value = "";
  renderQuestions();
}

function renderQuestions() {
  const quizContent = document.getElementById("quiz-content");
  quizContent.innerHTML = "";

  questions.forEach((q, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.className = "quiz-item";
    questionDiv.innerHTML = `
      <h3>Q${index + 1}: ${q.question}</h3>
      <p><strong>Answer:</strong> ${q.answer}</p>
    `;
    quizContent.appendChild(questionDiv);
  });
}

function exportQuizToPDF() {
  const quizContent = document.getElementById("quiz-content");
  if (questions.length === 0) {
    alert("Please add at least one question before exporting.");
    return;
  }

  const opt = {
    margin:       0.5,
    filename:     'quiz.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(quizContent).save();
}
