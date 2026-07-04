const mongoose = require("mongoose")

const interviewSessionSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    interviewReportId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InterviewReport"
    },
    track: {
        type: String,
        default: "MERN"
    },
    questions:[
    {
        question:{
            type:String,
            required:true
        },
        answer:String,
        feedback:String,
        idealAnswer:String,
        missingPoints:[
            {
                type:String
            }
        ],
        rubric: {
         clarity: Number,
        structure: Number,
        depth: Number,
        technicalAccuracy: Number,
        communication: Number
       }
      }
    ],
    currentStep: {
        type: Number,
        default: 0
    },
    completed: {
        type: Boolean,
        default: false
    }

} , {timestamps: true})

// Add indexes for faster queries
interviewSessionSchema.index({ user: 1 });
interviewSessionSchema.index({ user: 1, completed: 1 });

module.exports = mongoose.model("InterviewSession" , interviewSessionSchema); 