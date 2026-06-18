require("dotenv").config() 
const app = require("./src/app") 
const connectToDB = require("./src/config/database")

const start = async () => {
     try { 
        await connectToDB() // 👈 WAIT karega 
         app.listen(process.env.PORT || 3000, () => { 
        console.log("Server running on port 3000") 
    }) 
}
  catch (err) { 
    console.log(err)
 } 
}
 start()