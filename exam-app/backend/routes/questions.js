const express = require('express');
const Question = require('../models/Question');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/questions/random
// @desc    Get random questions for exam
// @access  Private
router.get('/random', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    // Get random questions using MongoDB aggregation
    const questions = await Question.aggregate([
      { $sample: { size: limit } },
      {
        $project: {
          _id: 1,
          question: 1,
          options: 1,
          category: 1,
          difficulty: 1
          // Don't include correctAnswer in the response
        }
      }
    ]);

    if (questions.length === 0) {
      return res.status(404).json({ message: 'No questions found' });
    }

    res.json({
      message: 'Questions fetched successfully',
      questions,
      totalQuestions: questions.length
    });
  } catch (error) {
    console.error('Get questions error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/questions/count
// @desc    Get total number of questions
// @access  Private
router.get('/count', auth, async (req, res) => {
  try {
    const count = await Question.countDocuments();
    res.json({ totalQuestions: count });
  } catch (error) {
    console.error('Get question count error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/questions/categories
// @desc    Get all question categories
// @access  Private
router.get('/categories', auth, async (req, res) => {
  try {
    const categories = await Question.distinct('category');
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;