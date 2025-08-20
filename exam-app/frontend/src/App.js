import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ExamStart from './components/Exam/ExamStart';
import ExamInterface from './components/Exam/ExamInterface';
import Results from './components/Exam/Results';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/exam/start" 
                element={
                  <ProtectedRoute>
                    <ExamStart />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/exam/take" 
                element={
                  <ProtectedRoute>
                    <ExamInterface />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/exam/results" 
                element={
                  <ProtectedRoute>
                    <Results />
                  </ProtectedRoute>
                } 
              />
              <Route path="/" element={<Navigate to="/exam/start" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;