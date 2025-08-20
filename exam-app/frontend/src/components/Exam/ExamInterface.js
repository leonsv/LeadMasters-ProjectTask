import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Timer from './Timer';
import api from '../../services/api';

const ExamInterface = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [startTime] = useState(Date.now());
  
  const navigate = useNavigate();
  const EXAM_DURATION = 30 * 60; // 30 minutes in seconds

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await api.get('/questions/random?limit=10');
      setQuestions(response.data.questions);
    } catch (err) {
      setError('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const submitExam = async () => {
    if (submitting) return;
    
    setSubmitting(true);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    
    try {
      // Prepare answers in the format expected by backend
      const formattedAnswers = questions.map(question => ({
        questionId: question._id,
        selectedAnswer: answers[question._id] ?? -1 // -1 for unanswered
      }));

      const response = await api.post('/exam/submit', {
        answers: formattedAnswers,
        timeTaken: timeTaken
      });

      // Navigate to results page with the exam data
      navigate('/exam/results', { 
        state: { result: response.data.result } 
      });
    } catch (err) {
      setError('Failed to submit exam');
      setSubmitting(false);
    }
  };

  const handleTimeUp = () => {
    if (!submitting) {
      submitExam();
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading exam questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="alert alert-error">
          {error}
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/exam/start')}
        >
          Back to Start
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="card">
        <div className="alert alert-error">
          No questions available for the exam.
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/exam/start')}
        >
          Back to Start
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;

  return (
    <div>
      <Timer duration={EXAM_DURATION} onTimeUp={handleTimeUp} />
      
      <div className="card card-wide">
        <div className="question-header">
          <div className="question-number">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <div className="progress-info">
            Answered: {answeredCount}/{questions.length}
          </div>
        </div>

        <div className="question-container">
          <div className="question-text">
            {currentQuestion.question}
          </div>

          <div className="options-container">
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className={`option ${answers[currentQuestion._id] === index ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(currentQuestion._id, index)}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion._id}`}
                  value={index}
                  checked={answers[currentQuestion._id] === index}
                  onChange={() => handleAnswerSelect(currentQuestion._id, index)}
                />
                <span className="option-text">{option}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="exam-navigation">
          <button
            className="btn btn-secondary"
            onClick={goToPrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>

          <div className="progress-info">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>

          {currentQuestionIndex === questions.length - 1 ? (
            <button
              className="btn btn-success"
              onClick={submitExam}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Exam'}
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={goToNext}
            >
              Next
            </button>
          )}
        </div>

        {submitting && (
          <div className="alert alert-info" style={{ marginTop: '1rem' }}>
            Submitting your exam... Please wait.
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamInterface;