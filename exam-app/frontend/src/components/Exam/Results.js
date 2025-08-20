import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);

  const result = location.state?.result;

  if (!result) {
    return (
      <div className="card">
        <div className="alert alert-error">
          No exam results found. Please take an exam first.
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/exam/start')}
        >
          Take Exam
        </button>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} minutes ${secs} seconds`;
  };

  const getScoreClass = () => {
    if (result.score >= 80) return 'excellent';
    if (result.score >= 60) return 'good';
    return 'poor';
  };

  const getGradeClass = () => {
    return `grade-${result.grade.toLowerCase()}`;
  };

  return (
    <div>
      <div className="card">
        <h2>Exam Results</h2>
        
        <div className="result-summary">
          <div className={`score-display ${getScoreClass()}`}>
            {result.score}%
          </div>
          
          <div className={`grade-display ${getGradeClass()}`}>
            Grade: {result.grade}
          </div>

          <div className="result-stats">
            <div className="stat-item">
              <div className="stat-number">{result.correctAnswers}</div>
              <div className="stat-label">Correct Answers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{result.totalQuestions - result.correctAnswers}</div>
              <div className="stat-label">Incorrect Answers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{result.totalQuestions}</div>
              <div className="stat-label">Total Questions</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{formatTime(result.timeTaken)}</div>
              <div className="stat-label">Time Taken</div>
            </div>
          </div>
        </div>

        <div className="btn-group">
          <button 
            className="btn btn-secondary"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Hide Details' : 'Show Question Details'}
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/exam/start')}
          >
            Take Another Exam
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="card">
          <h3>Question Details</h3>
          
          {result.questions.map((question, index) => (
            <div 
              key={question.questionId} 
              className="question-container"
              style={{ 
                border: '1px solid #ddd', 
                borderRadius: '8px', 
                padding: '1rem', 
                marginBottom: '1rem',
                backgroundColor: question.isCorrect ? '#d4edda' : '#f8d7da'
              }}
            >
              <div className="question-header">
                <div className="question-number">
                  Question {index + 1}
                  {question.isCorrect ? (
                    <span style={{ color: '#28a745', marginLeft: '10px' }}>✓ Correct</span>
                  ) : (
                    <span style={{ color: '#dc3545', marginLeft: '10px' }}>✗ Incorrect</span>
                  )}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                  Category: {question.category}
                </div>
              </div>

              <div className="question-text">
                {question.questionText}
              </div>

              <div className="options-container">
                {question.options.map((option, optionIndex) => {
                  let optionClass = 'option';
                  let optionStyle = {};

                  if (optionIndex === question.correctAnswer) {
                    optionClass += ' correct-answer';
                    optionStyle.backgroundColor = '#d4edda';
                    optionStyle.borderColor = '#28a745';
                  }
                  
                  if (optionIndex === question.selectedAnswer && optionIndex !== question.correctAnswer) {
                    optionClass += ' wrong-answer';
                    optionStyle.backgroundColor = '#f8d7da';
                    optionStyle.borderColor = '#dc3545';
                  }

                  return (
                    <div key={optionIndex} className={optionClass} style={optionStyle}>
                      <span className="option-text">
                        {String.fromCharCode(65 + optionIndex)}. {option}
                        {optionIndex === question.correctAnswer && (
                          <span style={{ color: '#28a745', marginLeft: '10px', fontWeight: 'bold' }}>
                            (Correct Answer)
                          </span>
                        )}
                        {optionIndex === question.selectedAnswer && optionIndex !== question.correctAnswer && (
                          <span style={{ color: '#dc3545', marginLeft: '10px', fontWeight: 'bold' }}>
                            (Your Answer)
                          </span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>

              {question.selectedAnswer === -1 && (
                <div className="alert alert-info" style={{ marginTop: '1rem' }}>
                  You did not answer this question.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Results;