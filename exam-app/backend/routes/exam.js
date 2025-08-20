const express = require('express');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/exam/submit
// @desc    Submit exam answers
// @access  Private
router.post('/submit', auth, async (req, res) => {
  try {
    const { answers, timeTaken } = req.body;

    // Validation
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: 'Answers are required' });
    }

    if (!timeTaken || timeTaken < 0) {
      return res.status(400).json({ message: 'Valid time taken is required' });
    }

    // Get the correct answers from database
    const questionIds = answers.map(answer => answer.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });

    if (questions.length !== answers.length) {
      return res.status(400).json({ message: 'Some questions not found' });
    }

    // Create exam result with detailed question analysis
    const examQuestions = answers.map(answer => {
      const question = questions.find(q => q._id.toString() === answer.questionId);
      const isCorrect = question.correctAnswer === answer.selectedAnswer;

      return {
        question: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        isCorrect: isCorrect
      };
    });

    // Create exam record
    const exam = new Exam({
      user: req.user._id,
      questions: examQuestions,
      totalQuestions: answers.length,
      timeTaken: timeTaken
    });

    await exam.save();

    // Populate question details for response
    await exam.populate('questions.question', 'question options correctAnswer category');

    // Prepare detailed results
    const detailedResults = exam.questions.map(q => ({
      questionId: q.question._id,
      questionText: q.question.question,
      options: q.question.options,
      selectedAnswer: q.selectedAnswer,
      correctAnswer: q.question.correctAnswer,
      isCorrect: q.isCorrect,
      category: q.question.category
    }));

    // Calculate grade
    let grade = 'F';
    if (exam.score >= 90) grade = 'A';
    else if (exam.score >= 80) grade = 'B';
    else if (exam.score >= 70) grade = 'C';
    else if (exam.score >= 60) grade = 'D';

    res.json({
      message: 'Exam submitted successfully',
      result: {
        examId: exam._id,
        score: exam.score,
        grade: grade,
        correctAnswers: exam.correctAnswers,
        totalQuestions: exam.totalQuestions,
        timeTaken: exam.timeTaken,
        submittedAt: exam.submittedAt,
        questions: detailedResults
      }
    });
  } catch (error) {
    console.error('Submit exam error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/exam/history
// @desc    Get user's exam history
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const exams = await Exam.find({ user: req.user._id })
      .select('score correctAnswers totalQuestions timeTaken submittedAt')
      .sort({ submittedAt: -1 })
      .limit(10);

    res.json({
      message: 'Exam history fetched successfully',
      exams: exams.map(exam => ({
        examId: exam._id,
        score: exam.score,
        correctAnswers: exam.correctAnswers,
        totalQuestions: exam.totalQuestions,
        timeTaken: exam.timeTaken,
        submittedAt: exam.submittedAt,
        grade: exam.score >= 90 ? 'A' : exam.score >= 80 ? 'B' : exam.score >= 70 ? 'C' : exam.score >= 60 ? 'D' : 'F'
      }))
    });
  } catch (error) {
    console.error('Get exam history error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/exam/:id
// @desc    Get specific exam details
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const exam = await Exam.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    }).populate('questions.question', 'question options correctAnswer category');

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    const detailedResults = exam.questions.map(q => ({
      questionId: q.question._id,
      questionText: q.question.question,
      options: q.question.options,
      selectedAnswer: q.selectedAnswer,
      correctAnswer: q.question.correctAnswer,
      isCorrect: q.isCorrect,
      category: q.question.category
    }));

    const grade = exam.score >= 90 ? 'A' : exam.score >= 80 ? 'B' : exam.score >= 70 ? 'C' : exam.score >= 60 ? 'D' : 'F';

    res.json({
      result: {
        examId: exam._id,
        score: exam.score,
        grade: grade,
        correctAnswers: exam.correctAnswers,
        totalQuestions: exam.totalQuestions,
        timeTaken: exam.timeTaken,
        submittedAt: exam.submittedAt,
        questions: detailedResults
      }
    });
  } catch (error) {
    console.error('Get exam details error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;