const mongoose = require('mongoose');
const Question = require('../models/Question');
require('dotenv').config();

const sampleQuestions = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
    category: "Geography",
    difficulty: "easy"
  },
  {
    question: "Which programming language is known as the 'language of the web'?",
    options: ["Python", "JavaScript", "Java", "C++"],
    correctAnswer: 1,
    category: "Technology",
    difficulty: "medium"
  },
  {
    question: "What is 25 × 4?",
    options: ["90", "100", "110", "120"],
    correctAnswer: 1,
    category: "Mathematics",
    difficulty: "easy"
  },
  {
    question: "Who wrote the novel '1984'?",
    options: ["Aldous Huxley", "Ray Bradbury", "George Orwell", "H.G. Wells"],
    correctAnswer: 2,
    category: "Literature",
    difficulty: "medium"
  },
  {
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: 2,
    category: "Science",
    difficulty: "medium"
  },
  {
    question: "In which year did World War II end?",
    options: ["1944", "1945", "1946", "1947"],
    correctAnswer: 1,
    category: "History",
    difficulty: "easy"
  },
  {
    question: "What is the largest planet in our solar system?",
    options: ["Saturn", "Jupiter", "Neptune", "Uranus"],
    correctAnswer: 1,
    category: "Science",
    difficulty: "easy"
  },
  {
    question: "Which data structure uses LIFO (Last In, First Out) principle?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    correctAnswer: 1,
    category: "Technology",
    difficulty: "medium"
  },
  {
    question: "What is the square root of 144?",
    options: ["10", "12", "14", "16"],
    correctAnswer: 1,
    category: "Mathematics",
    difficulty: "easy"
  },
  {
    question: "Which continent has the most countries?",
    options: ["Asia", "Europe", "Africa", "South America"],
    correctAnswer: 2,
    category: "Geography",
    difficulty: "medium"
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: 2,
    category: "Art",
    difficulty: "easy"
  },
  {
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(n²)"],
    correctAnswer: 1,
    category: "Technology",
    difficulty: "hard"
  },
  {
    question: "Which ocean is the largest?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correctAnswer: 3,
    category: "Geography",
    difficulty: "easy"
  },
  {
    question: "What is the powerhouse of the cell?",
    options: ["Nucleus", "Ribosome", "Mitochondria", "Endoplasmic Reticulum"],
    correctAnswer: 2,
    category: "Science",
    difficulty: "medium"
  },
  {
    question: "In JavaScript, what does 'typeof null' return?",
    options: ["null", "undefined", "object", "boolean"],
    correctAnswer: 2,
    category: "Technology",
    difficulty: "hard"
  },
  {
    question: "What is 7! (7 factorial)?",
    options: ["720", "5040", "840", "2520"],
    correctAnswer: 1,
    category: "Mathematics",
    difficulty: "hard"
  },
  {
    question: "Which Shakespeare play features the characters Romeo and Juliet?",
    options: ["Hamlet", "Macbeth", "Romeo and Juliet", "Othello"],
    correctAnswer: 2,
    category: "Literature",
    difficulty: "easy"
  },
  {
    question: "What is the currency of Japan?",
    options: ["Yuan", "Won", "Yen", "Ringgit"],
    correctAnswer: 2,
    category: "Geography",
    difficulty: "easy"
  },
  {
    question: "Which element has the atomic number 1?",
    options: ["Helium", "Hydrogen", "Lithium", "Carbon"],
    correctAnswer: 1,
    category: "Science",
    difficulty: "medium"
  },
  {
    question: "What does HTTP stand for?",
    options: ["HyperText Transfer Protocol", "High Tech Transfer Protocol", "HyperText Transport Protocol", "High Transfer Text Protocol"],
    correctAnswer: 0,
    category: "Technology",
    difficulty: "medium"
  }
];

const seedQuestions = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing questions
    await Question.deleteMany({});
    console.log('Cleared existing questions');

    // Insert sample questions
    await Question.insertMany(sampleQuestions);
    console.log(`Inserted ${sampleQuestions.length} sample questions`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedQuestions();