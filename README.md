# 🎯 YT-GENAI - AI-Powered Interview Preparation Platform

A full-stack web application that helps users prepare for job interviews using AI-powered personalized interview plans, mock interviews, and resume tailoring!

## ✨ Key Features

- 🤖 **AI-Generated Interview Reports**: Personalized reports based on your resume, self-description, and target job description
- 🎭 **Mock Interviews**: Practice with AI-generated questions tailored to your track (DSA, MERN, Core CS)
- 📄 **ATS Resume Tailoring**: Generate ATS-optimized resumes for your target role
- 📊 **Performance Tracking**: Keep track of your interview history and performance
- 🔐 **Secure Authentication**: JWT-based authentication with password hashing
- 🎨 **Dark/Light Mode Toggle**: Choose your preferred theme for comfortable practice
- 🔔 **Real-time Notifications & Notification Center**: Stay updated with important events
- 📧 **Email Verification & Password Reset**: Secure account recovery flow
- 📈 **Interview Performance Analytics**: Detailed analytics about your practice sessions
- 👥 **Collaborative Interview Practice**: Practice interviews with friends in real-time using WebSocket

## 🛠️ Tech Stack

### Frontend
- React 19
- React Router 7
- Axios
- React Hot Toast
- SASS
- Vite

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Google Gemini API
- Multer (File Uploads)
- Puppeteer (PDF Generation)
- Zod (Validation)
- Helmet + CORS (Security)
- Rate Limiting

### DevOps
- Docker & Docker Compose
- Swagger/OpenAPI (API Documentation)

## 🚀 Getting Started

### Option 1: Run with Docker (Recommended)

1. Make sure Docker & Docker Compose are installed on your system
2. Create a `.env` file in the `BACKEND` directory with:
   ```env
   MONGO_URI=mongodb://localhost:27017/yt-genai
   JWT_SECRET=your-secret-key-here
   GOOGLE_GENAI_API_KEY=your-google-api-key
   ```
3. From the project root directory, run:
   ```bash
   docker-compose up -d --build
   ```
4. The application will be available on:
   - Frontend: http://localhost
   - Backend API: http://localhost:3000
   - API Documentation: http://localhost:3000/api-docs

### Option 2: Run Locally without Docker

#### Backend Setup
1. Navigate to the BACKEND directory
2. Create a `.env` file (see example above)
3. Install dependencies: `npm install`
4. Start the server: `npm run dev`

#### Frontend Setup
1. Navigate to the FRONTEND directory
2. Create a `.env` file with:
   ```env
   VITE_API_URL=http://localhost:3000
   ```
3. Install dependencies: `npm install`
4. Start the dev server: `npm run dev`

## � Deployment

The project is ready for deployment! You can use Docker Compose for easy deployment.

### Step 1: Setup Environment Variables
```bash
# Copy the root .env.example file
cp .env.example .env
```

Fill in your API keys and SMTP credentials in the `.env` file!

### Step 2: Deploy with Docker Compose
```bash
# Build and start all services
docker-compose up -d --build
```

This will:
1. Start MongoDB database
2. Start the Backend API on port 3000
3. Start the Frontend on port 80

### Step 3: Access the App
- Frontend: `http://localhost`
- Backend API: `http://localhost:3000`
- API Docs: `http://localhost:3000/api-docs`

### Stopping the Services
```bash
docker-compose down
```

## �📖 API Documentation

API documentation is available at `http://localhost:3000/api-docs` when the backend is running!

## 🧪 Running Tests

(Coming Soon - We'll add tests soon!)

## 📂 Project Structure

```
YT-GENAI/
├── BACKEND/
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic & AI integration
│   │   ├── middleware/    # Custom middleware
│   │   ├── schemas/       # Zod validation schemas
│   │   ├── docs/          # Swagger config
│   │   ├── config/        # Environment config
│   │   └── app.js
│   └── server.js
├── FRONTEND/
│   └── src/
│       ├── features/      # Feature-based modules
│       ├── components/    # Reusable components
│       └── api/           # API client
└── docker-compose.yml
```

## ✅ Completed Features (From Future Enhancements)

- ✅ Email Verification & Password Reset
- ✅ Dark/Light Mode
- ✅ Real-time Notifications
- ✅ Interview Performance Analytics
- ✅ Collaborative Interview Practice

## 🔮 Future Enhancements

- Admin Panel
- TypeScript Migration

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Feel free to open a pull request or issue!
