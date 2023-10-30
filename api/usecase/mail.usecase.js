const nodemailer = require("nodemailer")
require("dotenv").config()

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
  const html = `<h1> Wellcome To Theater </h1>
  <form  action="http://localhost:8080/user/activated?id=${to.id}" method="post">
  <input type="submit" value="Submit" />
  </form>
  `
  console.log(to.key)
  const data = {
    from: `Theater<${process.env.GMAIL}>`,
    to: to.email,
    subject: "Activation Acount",
    html,
  }
  send(data)
}

module.exports = { sendEmailActivation, send }
