# YT-GENAI - Interview Preparation Guide

## What is this project?

YT-GENAI is a full-stack web application that helps job candidates prepare for interviews. It uses AI to create personalized interview plans, conduct mock interviews, and generate ATS-friendly resumes.

**Main Problem Solved:** Making interview preparation personalized and providing real-time feedback to candidates.

---

## Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **SASS** - Styling
- **React Router** - Navigation

### Backend
- **Node.js + Express.js** - Server
- **MongoDB** - Database
- **Google Gemini API** - AI features
- **JWT** - Authentication
- **Puppeteer** - PDF generation
- **Docker** - Deployment
```

---

## 🛠️ Tech Stack Deep Dive

### Frontend Technologies
- **React 19** - Latest React with modern hooks and features
- **React Router 7** - For SPA routing
- **Vite** - Fast build tool and dev server
- **SASS/SCSS** - Modular styling with variables and mixins
- **Axios** - HTTP client for API calls
- **React Hot Toast** - User notifications

### Backend Technologies
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Google Gemini API** - AI integration for question generation
- **Puppeteer** - PDF generation from HTML
- **Multer** - File upload handling (PDF resumes)
- **Zod** - Schema validation
- **JWT** - Authentication
- **Helmet + CORS** - Security middleware
- **Rate Limiting** - API protection

### DevOps
- **Docker & Docker Compose** - Containerization
- **Swagger/OpenAPI** - API documentation

---

## 📊 Database Models

### 1. User Model (`user.model.js`)
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  isVerified: Boolean,
  role: String,
  verificationToken: String,
  resetPasswordToken: String
}
```

### 2. Interview Report Model (`interviewReport.model.js`)
```javascript
{
  user: ObjectId (ref: users),
  title: String,
  matchScore: Number (0-100),
  resume: String,
  selfDescription: String,
  jobDescription: String,
  technicalQuestions: [{ question, intention, answer }],
  behavioralQuestions: [{ question, intention, answer }],
  skillGaps: [{ skill, severity }],
  preparationPlan: [{ day, focus, tasks }]
}
```

### 3. Interview Session Model (`interviewSession.model.js`)
```javascript
{
  user: ObjectId,
  interviewReportId: ObjectId,
  track: String (DSA/MERN/CORE),
  questions: [{
    question: String,
    answer: String,
    feedback: String,
    idealAnswer: String,
    missingPoints: [String],
    rubric: { clarity, structure, depth, technicalAccuracy, communication }
  }],
  currentStep: Number,
  completed: Boolean
}
```

---

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Description | Access |
|--------|----------|-----------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | User login | Public |
| POST | `/logout` | User logout | Private |
| GET | `/me` | Get current user | Private |
| POST | `/verify-email` | Email verification | Public |
| POST | `/resend-verification` | Resend verification email | Private |
| POST | `/forgot-password` | Request password reset | Public |
| POST | `/reset-password` | Reset password with token | Public |

### Interview Routes (`/api/interview`)
| Method | Endpoint | Description | Access |
|--------|----------|-----------|--------|
| POST | `/` | Generate interview report | Private |
| GET | `/` | Get all user reports | Private |
| GET | `/report/:id` | Get specific report | Private |
| POST | `/resume/pdf/:id` | Download ATS resume PDF | Private |

### Interview Session Routes (`/api/interview-session`)
| Method | Endpoint | Description | Access |
|--------|----------|-----------|--------|
| POST | `/start` | Start mock interview | Private |
| POST | `/submit-answer` | Submit answer & get feedback | Private |
| POST | `/update-progress` | Update session progress | Private |
| GET | `/` | Get all sessions | Private |
| GET | `/:id` | Get specific session | Private |

---

## 🤖 AI Integration (ai.service.js)

### Key AI Functions:

#### 1. `generateInterviewReport()`
- **Input**: Resume, self-description, job description
- **Output**: Personalized interview report with:
  - Match score (0-100)
  - Technical & behavioral questions
  - Skill gaps analysis
  - Day-wise preparation plan

#### 2. `generateResumePdf()`
- **Input**: Resume content, job description
- **Output**: ATS-optimized PDF resume
- Uses Puppeteer for PDF generation
- Fallback HTML template if AI unavailable

#### 3. `generateInterviewQuestion()`
- **Input**: Job description, track (DSA/MERN/CORE)
- **Output**: Track-specific interview question
- Implements track-based question filtering

#### 4. `evaluateAnswer()`
- **Input**: Question, user's answer
- **Output**: 
  - Feedback (2-3 lines)
  - Ideal answer
  - Missing points (3 items)
  - Rubric scores (clarity, structure, depth, technical accuracy, communication)

---

## 🎨 Frontend Features

### Dashboard Components
1. **DashboardHero** - Welcome section with CTA
2. **StatsGrid** - Performance statistics
3. **QuickActions** - Action buttons (Start Interview, Download Resume, etc.)
4. **InterviewOverview** - Technical/behavioral questions & roadmap
5. **RecentActivity** - Session history
6. **AICoachCard** - AI guidance
7. **TrackModal** - DSA/MERN/CORE track selection

### Session Features
- **Speech Recognition** - Voice-to-text answers
- **Auto-save** - LocalStorage draft saving
- **Progress Tracking** - Question navigation
- **Real-time Feedback** - AI evaluation after each answer
- **Keyboard Shortcuts** - Ctrl+Enter to submit, Alt+Arrow for navigation

---

## 🔐 Security Implementation

### Authentication Flow
1. **Password Hashing** - bcrypt with salt rounds
2. **JWT Tokens** - 1-day expiry, httpOnly cookies
3. **Token Blacklisting** - Logout tokens stored in DB
4. **Email Verification** - Token-based verification
5. **Password Reset** - Secure token flow

### Security Middleware
- **Helmet** - HTTP headers protection
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Prevent abuse
- **Input Validation** - Zod schemas

---

## 🚀 Key Technical Decisions

### 1. Feature-Based Architecture (Frontend)
```
src/
├── features/
│   ├── auth/
│   ├── interviews/
│   ├── theme/
│   └── notifications/
```
- Better code organization
- Easier maintenance
- Scalable structure

### 2. MVC Pattern (Backend)
```
src/
├── controllers/  # Business logic
├── models/       # Database schemas
├── routes/       # API endpoints
├── services/     # External integrations
└── middlewares/  # Custom middleware
```

### 3. AI Retry Mechanism
- 3 attempts with 2-second delay
- Fallback responses for offline mode
- Graceful degradation

### 4. Real-time Collaboration
- WebSocket integration
- Room-based practice sessions
- Code sharing capability

---

## 💡 Interview Ke Liye Important Points

### 1. Project ka Core Problem
> "Job interview preparation ko personalize karna aur candidates ko real-time feedback dena"

### 2. Unique Features
- **Track-based Questions** (DSA/MERN/CORE)
- **ATS Resume Generation**
- **Voice-to-text Answers**
- **Collaborative Practice**
- **Detailed Rubric Scoring**

### 3. Technical Challenges Solved
- **PDF Parsing** - Resume text extraction
- **AI Response Validation** - Zod schema validation
- **Session Persistence** - Auto-save implementation
- **Real-time Updates** - WebSocket integration

### 4. Scalability Considerations
- Database indexing on user fields
- Rate limiting for API protection
- Docker containerization
- Environment-based configuration

---

## 🎯 Demo Flow (Interview mein explain karne ke liye)

### Step 1: User Registration
- Email verification flow
- Secure password handling

### Step 2: Interview Report Generation
- Upload resume (PDF)
- Enter self-description
- Enter target job description
- AI generates personalized report

### Step 3: Mock Interview
- Select track (DSA/MERN/CORE)
- Answer 5 AI-generated questions
- Get real-time feedback with rubric scores

### Step 4: Performance Analytics
- View session history
- Download interview report
- Get ATS-optimized resume

---

## 📝 Code Snippets for Reference

### AI Service Integration
```javascript
// Track-specific question generation
if (track === "DSA") {
    trackInstruction = "Focus on Data Structures & Algorithms concepts..."
} else if (track === "MERN") {
    trackInstruction = "Focus on Full Stack development..."
}
```

### Session Management
```javascript
// Auto-save hook
const { getSaved, clearSaved } = useSessionAutoSave(sessionId, {
    answer, timer, currentStep, completed
})
```

### Authentication Middleware
```javascript
// JWT verification
const token = req.cookies.token
// Token blacklist check
const isBlacklisted = await tokenBlacklistModel.findOne({ token })
```

---

## 🚀 Deployment

### Docker Compose Setup
```yaml
services:
  mongodb:
    image: mongo:latest
  backend:
    build: ./BACKEND
    ports: ["3000:3000"]
  frontend:
    build: ./FRONTEND
    ports: ["80:80"]
```

### Environment Variables
```env
MONGO_URI=mongodb://localhost:27017/yt-genai
JWT_SECRET=your-secret-key
GOOGLE_GENAI_API_KEY=your-api-key
```

---

## 🎉 Summary

**YT-GENAI** ek modern, scalable interview preparation platform hai jismein:
- **AI-powered personalization** hai
- **Real-time feedback** system hai
- **Collaborative features** hain
- **Production-ready** security implementation hai
- **Docker-based** deployment ready hai

Is project ne **full-stack development**, **AI integration**, **real-time systems**, aur **user experience** ko combine kiya hai!