import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaTrophy } from "react-icons/fa";

const SkillValidation = ({ skill = "Plumbing" }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState(null);
  const [showScore, setShowScore] = useState(false);

  // Static questions for different skills
  const questionsBySkill = {
    "Plumbing": [
      {
        id: "p1",
        question: "Which tool is primarily used to clear clogged drains?",
        options: ["Pipe wrench", "Plunger", "Hacksaw", "Tape measure"],
        correctAnswer: 1
      },
      {
        id: "p2",
        question: "What is the standard diameter for a residential bathroom drain pipe?",
        options: ["1 inch", "1.25 inches", "1.5 inches", "2 inches"],
        correctAnswer: 2
      },
      {
        id: "p3",
        question: "Which type of pipe is most commonly used for water supply lines in modern homes?",
        options: ["Galvanized steel", "Cast iron", "PVC", "PEX"],
        correctAnswer: 3
      },
      {
        id: "p4",
        question: "What is the purpose of a P-trap in plumbing?",
        options: ["Increase water pressure", "Prevent sewer gases from entering the home", "Filter debris", "Reduce water usage"],
        correctAnswer: 1
      },
      {
        id: "p5",
        question: "Which fitting is used to connect two pipes of different materials?",
        options: ["Coupling", "Elbow", "Union", "Transition fitting"],
        correctAnswer: 3
      }
    ],
    "Electrical": [
      {
        id: "e1",
        question: "What is the standard voltage in residential outlets in the United States?",
        options: ["110-120V", "220-240V", "12V", "480V"],
        correctAnswer: 0
      },
      {
        id: "e2",
        question: "Which wire color typically indicates a hot wire in US residential wiring?",
        options: ["White", "Green", "Black", "Blue"],
        correctAnswer: 2
      },
      {
        id: "e3",
        question: "What does GFCI stand for?",
        options: ["Ground Fault Circuit Interrupter", "General Function Control Interface", "Global Fuse Circuit Indicator", "Ground Force Current Inverter"],
        correctAnswer: 0
      },
      {
        id: "e4",
        question: "Which tool is used to measure electrical current?",
        options: ["Voltmeter", "Ammeter", "Ohmmeter", "Multimeter"],
        correctAnswer: 1
      },
      {
        id: "e5",
        question: "What is the purpose of a circuit breaker?",
        options: ["Increase voltage", "Prevent electrical overload", "Boost electrical signals", "Filter electrical noise"],
        correctAnswer: 1
      }
    ],
    "Carpentry": [
      {
        id: "c1",
        question: "Which tool is best for making precise cuts in wood?",
        options: ["Circular saw", "Jigsaw", "Table saw", "Miter saw"],
        correctAnswer: 3
      },
      {
        id: "c2",
        question: "What is the standard height for kitchen countertops?",
        options: ["30 inches", "34 inches", "36 inches", "40 inches"],
        correctAnswer: 2
      },
      {
        id: "c3",
        question: "Which type of joint is commonly used for connecting two pieces of wood at a 90-degree angle?",
        options: ["Butt joint", "Dovetail joint", "Mortise and tenon joint", "Miter joint"],
        correctAnswer: 3
      },
      {
        id: "c4",
        question: "What is the most common spacing for wall studs in residential construction?",
        options: ["12 inches on center", "16 inches on center", "24 inches on center", "32 inches on center"],
        correctAnswer: 1
      },
      {
        id: "c5",
        question: "Which wood is known for its resistance to rot and insects?",
        options: ["Pine", "Oak", "Cedar", "Maple"],
        correctAnswer: 2
      }
    ]
  };

  // Default questions for skills not in our database
  const defaultQuestions = [
    {
      id: "d1",
      question: "What is your level of experience in this field?",
      options: ["Beginner", "Intermediate", "Advanced", "Expert"],
      correctAnswer: 2
    },
    {
      id: "d2",
      question: "How many years have you been working in this industry?",
      options: ["Less than 1 year", "1-3 years", "3-5 years", "More than 5 years"],
      correctAnswer: 3
    },
    {
      id: "d3",
      question: "Have you completed formal training or certification?",
      options: ["No formal training", "Some courses", "Certified", "Advanced certification"],
      correctAnswer: 2
    },
    {
      id: "d4",
      question: "How comfortable are you teaching others in this field?",
      options: ["Not comfortable", "Somewhat comfortable", "Comfortable", "Very comfortable"],
      correctAnswer: 3
    },
    {
      id: "d5",
      question: "How do you stay updated with the latest developments in your field?",
      options: ["I don't regularly update my knowledge", "Online articles", "Professional training", "Industry conferences and continuous learning"],
      correctAnswer: 3
    }
  ];

  // Load questions based on skill
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API delay for a more realistic experience
    setTimeout(() => {
      const skillQuestions = questionsBySkill[skill] || defaultQuestions;
      setQuestions(skillQuestions);
      setSelectedAnswers({});
      setIsLoading(false);
    }, 800);
  }, [skill]);

  const calculateScore = () => {
    let correctCount = 0;
    
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });
    
    return (correctCount / questions.length) * 100;
  };

  const handleOptionSelect = (questionId, optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionIndex
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setShowScore(true);
  };

  const handleTryAgain = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowScore(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stdBg to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stdBlue"></div>
      </div>
    );
  }

  if (showScore) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stdBg to-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <FaTrophy className="text-6xl text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{skill} Validation Complete!</h2>
            <p className="text-xl text-gray-700 mb-2">Your Score:</p>
            <p className="text-4xl font-bold text-stdBlue mb-6">{score.toFixed(1)}%</p>
            <div className="space-y-4">
              <p className="text-gray-600">
                You answered {Object.keys(selectedAnswers).length} out of {questions.length} questions.
              </p>
              <p className="text-gray-600 mb-6">
                {score >= 70 
                  ? "Congratulations! You've demonstrated good knowledge in this skill." 
                  : "Keep learning! You can improve your score with more practice."}
              </p>
              <button
                onClick={handleTryAgain}
                className="px-8 py-3 bg-stdBlue text-white rounded-xl hover:bg-blue-600 transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-b from-stdBg to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Header with skill name */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-stdBlue">{skill} Skill Validation</h1>
            <p className="text-gray-600">Answer the following questions to validate your knowledge</p>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-stdBlue">
                {currentQuestion + 1} of {questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-stdBlue h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          {currentQ && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {currentQ.question}
              </h2>
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(currentQ.id, index)}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200
                      ${selectedAnswers[currentQ.id] === index
                        ? 'border-stdBlue bg-stdBlue/10 text-stdBlue'
                        : 'border-gray-200 hover:border-stdBlue/50'
                      }`}
                  >
                  {option}
                  </button>
              ))}
            </div>
        </div>
      )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 
                text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-300"
            >
              <FaArrowLeft className="text-sm" />
              Previous
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-stdBlue 
                  text-white hover:bg-blue-600 transition-all duration-300"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-stdBlue 
                  text-white hover:bg-blue-600 transition-all duration-300"
              >
                Next
                <FaArrowRight className="text-sm" />
              </button>
            )}
          </div>
        </div>
        </div>
    </div>
  );
};

export default SkillValidation;
