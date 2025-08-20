const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questions: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    },
    selectedAnswer: {
      type: Number,
      min: 0,
      max: 3
    },
    isCorrect: {
      type: Boolean
    }
  }],
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  timeTaken: {
    type: Number, // in seconds
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate score before saving
ExamSchema.pre('save', function(next) {
  const correctAnswers = this.questions.filter(q => q.isCorrect === true).length;
  this.correctAnswers = correctAnswers;
  this.score = Math.round((correctAnswers / this.totalQuestions) * 100);
  next();
});

module.exports = mongoose.model('Exam', ExamSchema);