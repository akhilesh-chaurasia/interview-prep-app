const multer = require("multer")


const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 3 * 1024 * 1024 // 3MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true)
        } else {
            const error = new Error("Only PDF files are supported for resume upload")
            error.statusCode = 400
            cb(error, false)
        }
    }
})


module.exports = upload