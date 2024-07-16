import express, { json } from "express"
import session from "express-session"
import * as mysql from "mysql"
import path from "node:path"
import { password } from "../config/config.json"

interface accountsData {
    uid: number
    password: string
    nickName: string
    grade: number
}

const server = express()

server.use(session({
    secret: 'a;/sadklnfvlfoje',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: password,
    database: "dodang"
})

declare module 'express-session' {
    interface SessionData {
        uid: number
        password: string
        nickName: string
        grade: number
    }
}


db.connect()
server.use(express.urlencoded({ extended: false, limit:"5mb" }), express.json({ limit:"5mb" }))

server.get("/", (req, res) => {
    if(req.session.uid) {
        res.redirect("/home")
    } else {
        res.sendFile(path.join(__dirname, "../../app/public/html/index.html"))
    }
})

server.get("/home", (req, res) => {
    if(req.session.uid) {
        res.sendFile(path.join(__dirname, "../../app/public/html/home.html"))
    } else {
        res.redirect("/")
    }
})

server.post("/sign-in", (req, res) => {
    const userName = req.body.userName
    const password = req.body.password
    db.query("SELECT * FROM accounts WHERE uid=?;", [userName], (err, result) => {
        if(err) throw err
        if(result.length === 1) {
            const account = result[0]
            if(account.password === password) {
                req.session.uid = account.uid
                req.session.nickName = account.nickName
                req.session.grade = account.grade
                res.json({msg: "succeed"})
            } else {
                res.json({msg: "wrongPassword"})
            }
        } else {
            res.json({msg: "noExist"})
        }
    })
})

server.use(express.static(`${__dirname}/../../app/public`))

server.listen(80, () => {
    console.log("localhost opened")
})