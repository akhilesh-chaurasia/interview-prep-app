const mongoose = require("mongoose")
const env = require("./env")


async function connectToDB(){
    try {
        await mongoose.connect(env.MONGO_URI)
        console.log("Connected to Database")
    }
    catch(err){
        console.error("Failed to connect to database:", err)
        process.exit(1)
    }
    
}

module.exports = connectToDB