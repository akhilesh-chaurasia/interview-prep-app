const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")

const app = express()

// Swagger Docs
const { specs, swaggerUi } = require("./docs/swagger")
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

const env = require("./config/env")

// 1. CORS FIRST!
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        env.FRONTEND_URL
    ],
    credentials: true
}))

// 2. Helmet with CORS-friendly settings
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}))

// 3. More lenient rate limits for development
// General rate limiter - increased for development
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5000, // limit each IP to 5000 requests per windowMs (increased from 1000)
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
})

// Auth routes rate limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 500, // increased from 200
  message: "Too many auth attempts from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
})

// Interview routes rate limiter - more lenient
const interviewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 2000, // 2000 requests per 15 minutes for interview routes
  message: "Too many interview requests, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
})

app.use("/api/auth", authLimiter)
app.use("/api/interview", interviewLimiter)
app.use("/api", generalLimiter)

app.use(express.json())
app.use(cookieParser())

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")
const interviewSessionRouter = require("./routes/interviewSession.routes")
const adminRouter = require("./routes/admin.routes")

/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)
app.use("/api/interview/session" , interviewSessionRouter)
app.use("/api/admin", adminRouter)


app.use((err , req , res , next)=>{
    console.log(err);

    return res.status(500).json({
        message:"Internal server error"
    })
})


// Export the app
module.exports = app