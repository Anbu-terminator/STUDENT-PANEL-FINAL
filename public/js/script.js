document.getElementById('examForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const answers = {};
  const formData = new FormData(e.target);

  for (const [key, value] of formData.entries()) {
      answers[key] = value;
  }

  console.log('Submitted Answers:', answers);

  alert('Your answers have been submitted successfully!');
});
