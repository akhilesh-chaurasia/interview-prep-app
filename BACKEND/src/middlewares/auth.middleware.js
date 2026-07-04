const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")



async function authUser(req, res, next) {
    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({
                message: "Token not provided."
            })
        }

        const isTokenBlacklisted = await tokenBlacklistModel.findOne({
            token
        })

        if (isTokenBlacklisted) {
            return res.status(401).json({
                message: "token is invalid"
            })
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.user = decoded

            next()

        } catch (err) {

            return res.status(401).json({
                message: "Invalid token."
            })
        }
    } catch (err) {
        // Any unexpected failure (e.g. DB hiccup on the blacklist lookup) must still
        // send a response — otherwise the request hangs forever with no reply, and
        // the frontend page stays stuck on its loading spinner indefinitely.
        console.log(err)
        return res.status(500).json({
            message: "Authentication check failed. Please try again."
        })
    }
}


module.exports = { authUser }