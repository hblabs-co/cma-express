import { APILogger } from '../logger/index.js'
import basicAuth from 'express-basic-auth'
import jwt from 'jsonwebtoken'

const SECRET_TOKEN = "PntYNo9rG9NpVn9QZjKQd3VAiv7JyxoC6G6Ld3G71TQyY2YnKf5pfGJZ9KqssBdfwxJX2NXiEqYJsBKAbOzYOKrWsPYQjQrargR8dAltoez1pmZsCcgP9WzaZRfqljkc"
const MINUTE = 60

const admin = {
    "helmer@hblabs.co": "4MkiiqgEEZhkrACFdw94"
}

const users = {
    "fernando@hblabs.co": "uPvT3MoTBBZK6ntmlAVP",
    "wilmer@hblabs.co": "oAw6hhUtkp4sX316wtl3"
}

const unauthorizedResponse = (req) => {
    if (req.auth) {
        return { message: 'Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected' }
    } else {
        return { message: 'No credentials provided' }
    }
}
const authenticateAdmin = basicAuth({ users: { ...admin }, challenge: false, unauthorizedResponse })
const authenticateUser = basicAuth({ users: { ...admin, ...users }, challenge: false, unauthorizedResponse })

const issueToken = async (req, res) => {
    const { user, passsword } = req.auth
    const token = jwt.sign({ user }, SECRET_TOKEN, { expiresIn: MINUTE * 5 })
    res.status(200).json({ token_type: "Bearer", expires_in: "5 Minutes", token: token })
}

const validateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.status(401).json({ message: "Token not valid" })

    jwt.verify(token, SECRET_TOKEN, (err, decodedToken) => {

        if (err) {
            APILogger.info(`${err.message}`)
            return res.status(401).json({ message: "Token not valid", error: err.message || err })
        }

        req.user = decodedToken.user

        if (!req.user) {
            return res.status(401).json({ message: `user ${req.user} unknown` })
        }

        APILogger.info(`${req.user} successfully authenticaed`)

        next()
    })
}

const afterTokenValidation = async (req, res) => {
    res.status(200).json({ user: req.user, message: "token is valid" })
}

export const AuthMiddlewares = {
    authenticateAdmin,
    authenticateUser,
    issueToken,
    validateToken,
    afterTokenValidation
}