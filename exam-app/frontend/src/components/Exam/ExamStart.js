import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const ExamStart = () => {
  const [questionCount, setQuestionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestionCount();
  }, []);

  const fetchQuestionCount = async () => {
    try {
      const response = await api.get('/questions/count');
      setQuestionCount(response.data.totalQuestions);
    } catch (err) {
      setError('Failed to load exam information');
    } finally {
      setLoading(false);
    }
  };

  const startExam = () => {
    navigate('/exam/take');
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading exam information...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Welcome to the Exam Portal</h2>
      
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <div className="result-summary">
        <h3>Hello, {user?.name}!</h3>
        <p>You are about to start your examination. Please read the instructions carefully before proceeding.</p>
      </div>

      <div className="card" style={{ backgroundColor: '#f8f9fa', margin: '1rem 0' }}>
        <h4>Exam Instructions</h4>
        <ul style={{ textAlign: 'left', lineHeight: '1.6' }}>
          <li>Total number of questions: <strong>10 questions</strong></li>
          <li>Available questions in database: <strong>{questionCount} questions</strong></li>
          <li>Time limit: <strong>30 minutes</strong></li>
          <li>Questions are randomly selected from the question bank</li>
          <li>Each question has 4 multiple choice options</li>
          <li>You can navigate between questions using Next/Previous buttons</li>
          <li>The exam will auto-submit when time expires</li>
          <li>You can submit the exam manually at any time</li>
          <li>Make sure you have a stable internet connection</li>
          <li>Once started, you cannot pause or restart the exam</li>
        </ul>
      </div>

      <div className="alert alert-info">
        <strong>Important:</strong> Once you click "Start Exam", the timer will begin immediately. 
        Make sure you are ready to begin.
      </div>

      <div className="btn-group">
        <button 
          className="btn btn-success"
          onClick={startExam}
          disabled={questionCount === 0}
        >
          Start Exam
        </button>
      </div>

      {questionCount === 0 && (
        <div className="alert alert-error" style={{ marginTop: '1rem' }}>
          No questions available in the database. Please contact the administrator.
        </div>
      )}
    </div>
  );
};

export default ExamStart;