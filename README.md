# Student-Side Exam-Taking Full-Stack Application

## Tech Stack
- Frontend: React.js
- Backend: Node.js + Express.js
- Database: MongoDB

## Prerequisites
Before running this application, make sure you have:

- Node.js 
- MongoDB 
- npm - Package manager
- Git - Version control

## Setup Instructions

### Backend
1. `cd backend`
2. `npm run dev`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm start`

### Database
- Seed sample questions to MongoDB using a script.

##  Usage Guide

1. **Registration/Login**
   - Navigate to `http://localhost:3000`
   - Register new account or login
   - Redirected to exam dashboard

2. **Taking Exam**
   - Click "Start Exam" from dashboard
   - Read instructions carefully
   - Click "Start Exam" to begin timer
   - Answer questions using radio buttons
   - Navigate with Next/Previous buttons
   - Submit manually or wait for auto-submit

3. **View Results**
   - Immediate score and grade display
   - View detailed question analysis
   - See correct/incorrect answers
   - Time taken information

4. **API Testing**
   - Import Postman collection from `/postman/`
   - Set base URL to `http://localhost:5000/api`
   - Test all endpoints with authentication

5. **Database Access**
   ```bash
   # Connect to MongoDB
   mongo exam-app
   
   # View collections
   show collections
   
   # View users
   db.users.find()
   
   # View questions
   db.questions.find()
   
   # View exams
   db.exams.find()
   ```

## Features
- JWT-based auth (register/login)
- Exam start with random questions
- MCQ display and navigation
- 30-minute timer with auto-submit
- Score calculation and result page
