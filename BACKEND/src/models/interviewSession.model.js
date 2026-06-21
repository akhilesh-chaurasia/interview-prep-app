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

module.exports = mongoose.model("InterviewSession" , interviewSessionSchema); 