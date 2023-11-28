const nodemailer = require("nodemailer")
require("dotenv").config()
const ejs = require("ejs")
const path = require("path")
const fs = require("fs")
const createJwt = require("./token.usecase")


const config = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL,
    pass: process.env.PASS,
  },
}

const send = async (data) => {
  const transpoter = nodemailer.createTransport(config)
  transpoter.sendMail(data, (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log("Email Succesfully Sended")
    }
  })
}

const sendEmailActivation = async (to) => {
  const file = fs.readFileSync(
    path.join(__dirname, "../../views/email.page.ejs"),
    "ascii",
  )
  const token = createJwt(to.id)

  const redered = ejs.render(file, {
    title: "Email | Activation",
    time: new Date(Date.now()).toDateString(),
    link: process.env.APP_URL,
    token,
    name: to.name,
    id:to.id,
  })
  const data = {
    from: `Cinemas<${process.env.GMAIL}>`,
    to: to.email,
    subject: "Activation Acount",
    html: redered,
  }
  send(data)
}

module.exports = { sendEmailActivation, send }
