import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const questions = [
  { id: 1, text: 'What is 2 + 3?', options: ['4', '5', '6'], correct: '5', reference: 'Basic addition: 2 + 3 = 5' },
  { id: 2, text: 'What is 10 × 4?', options: ['20', '40', '50'], correct: '40', reference: 'Multiplication: 10 × 4 = 40' },
  // Add 8 more questions here
];

function App() {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/validate', { answers });
      setResult(response.data);
    } catch (error) {
      console.error('Error submitting answers:', error);
    }
  };

  return (
    <div className="App">
      <h1>Skill Validation Quiz</h1>
      {questions.map((q) => (
        <div key={q.id} className="question">
          <p>{q.text}</p>
          {q.options.map((option) => (
            <label key={option}>
              <input
                type="radio"
                name={`question-${q.id}`}
                value={option}
                onChange={() => handleAnswerChange(q.id, option)}
              />
              {option}
            </label>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit}>Submit</button>

      {result && (
        <div className="result">
          <h2>Result: {result.score}%</h2>
          <p>{result.validated ? 'Validated!' : 'Not validated. Try again!'}</p>
          <h3>References:</h3>
          <ul>
            {result.references.map((ref, idx) => (
              <li key={idx}>{ref}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;