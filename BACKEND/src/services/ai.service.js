const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")
const env = require("../config/env")

const ai = new GoogleGenAI({
    apiKey: env.GOOGLE_GENAI_API_KEY
})

const questionSchema = z.object({
    question: z.string()
})

const feedbackSchema = z.object({
    feedback: z.string(),
    shouldEnd: z.boolean()
})

const evaluationSchema = z.object({
    feedback: z.string().describe("2-3 short lines of feedback on the candidate's answer"),
    idealAnswer: z.string().describe("An ideal, well-structured interview answer to this question"),
    missingPoints: z.array(z.string()).describe("Exactly 3 key points the candidate's answer was missing"),
    rubric: z.object({
        clarity: z.number().describe("Score from 0 to 10"),
        structure: z.number().describe("Score from 0 to 10"),
        depth: z.number().describe("Score from 0 to 10"),
        technicalAccuracy: z.number().describe("Score from 0 to 10"),
        communication: z.number().describe("Score from 0 to 10")
    }),
    shouldEnd: z.boolean()
})

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
`

    try {
        let response
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: prompt,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: zodToJsonSchema(interviewReportSchema),
                    }
                })
                break
            } catch (err) {
                console.log(`Interview report attempt ${attempt} failed`)
                if (attempt === 3) {
                    throw err
                }
                await new Promise(resolve => setTimeout(resolve, 2000))
            }
        }

        return JSON.parse(response.text)

    } catch (err) {
        console.log("Gemini unavailable. Using fallback interview report.")
        
        // Fallback report
        return {
            title: "Software Engineer Interview Plan",
            matchScore: 75,
            technicalQuestions: [
                {
                    question: "What is the difference between let, const and var in JavaScript?",
                    intention: "To test the candidate's understanding of variable scoping in JavaScript",
                    answer: "var is function-scoped, let and const are block-scoped. const variables cannot be reassigned but their properties can change if they're objects/arrays. Using let/const is preferred in modern JS to avoid accidental global declarations and hoisting issues."
                },
                {
                    question: "Explain how React's useEffect hook works.",
                    intention: "To assess understanding of React lifecycle management",
                    answer: "useEffect is used for side effects (data fetching, subscriptions, DOM manipulation). It takes a callback and a dependency array. If dependencies change, it runs again after the render. Empty dependency array runs once on mount; no array runs after every render."
                }
            ],
            behavioralQuestions: [
                {
                    question: "Tell me about a time you solved a difficult problem.",
                    intention: "To evaluate problem-solving approach and communication",
                    answer: "Use the STAR framework: Situation, Task, Action, Result. Describe the challenge, what you did, and the outcome with numbers if possible."
                }
            ],
            skillGaps: [
                { skill: "System Design", severity: "medium" },
                { skill: "Advanced Algorithms", severity: "low" }
            ],
            preparationPlan: [
                {
                    day: 1,
                    focus: "Resume & Story Preparation",
                    tasks: [
                        "Review your resume and prepare STAR stories",
                        "Research the company and role"
                    ]
                },
                {
                    day: 2,
                    focus: "Technical Review",
                    tasks: [
                        "Practice common JS questions",
                        "Review React fundamentals"
                    ]
                }
            ]
        }
    }
}



async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    })
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    try {
        let response
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: prompt,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: zodToJsonSchema(resumePdfSchema),
                    }
                })
                break
            } catch (err) {
                console.log(`Resume PDF attempt ${attempt} failed`)
                if (attempt === 3) {
                    throw err
                }
                await new Promise(resolve => setTimeout(resolve, 2000))
            }
        }

        const jsonContent = JSON.parse(response.text)
        const pdfBuffer = await generatePdfFromHtml(jsonContent.html)
        return pdfBuffer

    } catch (err) {
        console.log("Gemini unavailable. Using fallback resume PDF.")
        
        // Fallback HTML resume
        const fallbackHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Resume</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
        }
        h1 { color: #2563eb; margin-bottom: 5px; }
        .section { margin: 20px 0; }
        h2 { border-bottom: 1px solid #ddd; padding-bottom: 5px; color: #374151; }
    </style>
</head>
<body>
    <h1>Candidate Resume</h1>
    <div class="section">
        <h2>Experience</h2>
        <p>Worked on various software development projects.</p>
    </div>
    <div class="section">
        <h2>Skills</h2>
        <p>JavaScript, React, Node.js, MongoDB</p>
    </div>
    <div class="section">
        <h2>Education</h2>
        <p>Bachelor's Degree in Computer Science</p>
    </div>
</body>
</html>
        `
        return await generatePdfFromHtml(fallbackHtml)
    }
}

async function generateInterviewQuestion({ jobDescription, track }) { // <-- 1. Yahan track accept kiya

    try {
        // 2. Track ke aadhar par strict custom instructions set karo
        let trackInstruction = "";
        
        if (track === "DSA") {
            trackInstruction = `
            CRITICAL INSTRUCTION: The user has explicitly selected the Data Structures & Algorithms (DSA) track.
            - You must ignore web development frameworks, databases, and language-specific tools mentioned in the job description.
            - Generate exactly 1 question based purely on Core DSA concepts (e.g., Arrays, Strings, Hashing, Linked Lists, Stacks, Queues, Trees, Graphs, Sorting/Searching, or Dynamic Programming).
            - The question should test problem-solving logic and algorithmic thinking appropriate for a Software Engineer Intern.`;
        } else if (track === "MERN") {
            trackInstruction = `
            CRITICAL INSTRUCTION: The user has explicitly selected the MERN Stack track.
            - Focus exclusively on Full Stack development concepts based on the MERN stack (MongoDB, Express.js, React.js, Node.js, JavaScript, and REST APIs).
            - Keep the question relevant to building, optimizing, or debugging web applications.`;
        } else if (track === "CORE") {
            trackInstruction = `
            CRITICAL INSTRUCTION: The user has explicitly selected Core CS Fundamentals.
            - Focus purely on core computer science subjects: Operating Systems (OS), Database Management Systems (DBMS), SQL queries, or Object-Oriented Programming (OOPs) concepts.
            - Do not ask competitive programming algorithms or web framework development questions.`;
        } else {
            // Fallback agar track na mile toh purana behavior
            trackInstruction = `Generate 1 interview question based on this job description: ${jobDescription}`;
        }

        // 3. Final modified prompt with track injection
        const prompt = `
        You are a strict technical interviewer conducting a mock interview for a Software Engineer Intern role.
        
        ${trackInstruction}

        Use the following Job Description ONLY to gauge the overall difficulty expectations of the company, but STRICTLY follow the track rules specified above:
        ${jobDescription}

        Return JSON:
        {
          "question": "..."
        }
        `

        let response

        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: prompt,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: zodToJsonSchema(questionSchema)
                    }
                })
                break
            } catch (err) {
                console.log(`Question generation attempt ${attempt} failed`)
                if (attempt === 3) {
                    throw err
                }
                await new Promise(resolve => setTimeout(resolve, 2000))
            }
        }

        const rawText = response.candidates[0].content.parts[0].text

        const cleanedText = rawText
            .replace(/```json\s*/g, "")
            .replace(/```/g, "")
            .trim()

        const data = JSON.parse(cleanedText)
        return data

    } catch (err) {
        console.log("Gemini unavailable. Using fallback question.")
        
        // Fallback question bhi track ke hisab se responsive kar dete hain taaki crash na lage
        if (track === "DSA") {
            return { question: "Given an array of integers, find the contiguous subarray which has the largest sum and return its sum. Explain your approach." }
        }
        if (track === "CORE") {
            return { question: "What is the difference between a process and a thread? Explain how context switching works in Operating Systems." }
        }
        return {
            question: "Tell me about a challenging project you worked on and explain the technical decisions you made."
        }
    }
}


async function evaluateAnswer({ question, answer }) {

    try {

     const prompt = `
Evaluate this interview answer.

Question:
${String(question)}

Answer:
${String(answer)}

Give feedback in 2-3 short lines.

Also generate:
1. Ideal interview answer
2. 3 missing points

Also score (0-10):
- clarity
- structure
- depth
- technicalAccuracy
- communication

Return ONLY valid JSON:
{
  "feedback": "",
  "idealAnswer": "",
  "missingPoints": ["", "", ""],
  "rubric": {
    "clarity": 0,
    "structure": 0,
    "depth": 0,
    "technicalAccuracy": 0,
    "communication": 0
  },
  "shouldEnd": false
}
`
 
let response

for (let attempt = 1; attempt <= 3; attempt++) {

    try {

        response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(evaluationSchema),
            }
        })

        break

    } catch (err) {

        console.log(
            `Feedback attempt ${attempt} failed`
        )

        if (attempt === 3) {
            throw err
        }

        await new Promise(resolve =>
            setTimeout(resolve, 2000)
        )
    }
}

        const rawText =
    response.candidates[0].content.parts[0].text

const cleanedText = rawText
    .replace(/```json\s*/g, "")
    .replace(/```/g, "")
    .trim()

const data = JSON.parse(cleanedText)

return data

    } catch (err) {

    console.log(
        "Gemini unavailable. Using fallback feedback."
    )
    
   return {
    feedback:
        "Good attempt. Try adding more technical details and specific examples from your experience.",
    shouldEnd: false,

    idealAnswer:
        "A strong answer would include relevant experience, technical details, measurable achievements and a clear conclusion.",

    missingPoints: [
        "Specific example",
        "Technical depth",
        "Measurable impact"
    ],

    rubric: {
        clarity: 5,
        structure: 5,
        depth: 5,
        technicalAccuracy: 5,
        communication: 5
    }
    }
  }
}

module.exports = { generateInterviewReport, generateResumePdf , generateInterviewQuestion , evaluateAnswer }