const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: [{
    type: String,
    required: true,
    trim: true
  }],
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Ensure options array has exactly 4 elements
QuestionSchema.pre('save', function(next) {
  if (this.options.length !== 4) {
    return next(new Error('Question must have exactly 4 options'));
  }
  next();
});

module.exports = mongoose.model('Question', QuestionSchema);