import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [skill, setSkill] = useState("");

  // Fetch questions based on skill
  const fetchQuestions = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/generate-questions", { skill });
      setQuestions(response.data.questions);
      setAnswers({});
      setResult(null);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  // Handle answer selection
  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  // Submit answers for validation
  const handleSubmit = async () => {
    try {
      const answerPayload = {};
      questions.forEach((question, index) => {
        answerPayload[question._id] = answers[question._id] || "";
      });
      const response = await axios.post("http://localhost:8000/api/validate", { answers: answerPayload });
      setResult(response.data);
    } catch (error) {
      console.error("Error submitting answers:", error);
    }
  };

  return (
    <div className="App">
      <h1>Skill Validation Quiz</h1>

      {/* Skill input and fetch button */}
      <input
        type="text"
        placeholder="Enter skill (e.g., JavaScript)"
        value={skill}
        onChange={(e) => setSkill(e.target.value)}
      />
      <button onClick={fetchQuestions}>Generate Questions</button>

      {/* Display questions */}
      {questions.length > 0 && (
        <div>
          {questions.map((q, index) => (
            <div key={q._id} className="question">
              <p>{q.question}</p>
              {q.options.map((option, i) => (
                <label key={i}>
                  <input
                    type="radio"
                    name={`question-${q._id}`}
                    value={option}
                    onChange={() => handleAnswerChange(q._id, option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          ))}
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}

      {/* Display results */}
      {result && (
        <div className="result">
          <h2>Result: {result.score}%</h2>
          <p>{result.validated ? "Validated!" : "Not validated. Try again!"}</p>
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
