const { validateUser } = require("../api/middleware/validation")

const viewRoute = require("express").Router()

viewRoute.get("/login", (req, res) => {
  return res.render("login.page.ejs", {
    title: "Login | Cinema",
  })
})

viewRoute.get("/register", (req, res) => {
  return res.render("register.page.ejs", {
    title: "Register | Cinema",
  })
})

viewRoute.get("/response", (req, res) => {
  const response = req.query
  return res.render("response.page.ejs", {
    title: "Response | Cinema",
    message: response.message,
    name: response.name,
    expire: response.expire_at,
  })
})

viewRoute.get("/success", validateUser, (req, res) => {
  const { token, name, expire } = req
  return res.render("success.page.ejs", {
    title: "Home | Cinema",
    token,
    expire,
    name,
  })
})
module.exports = viewRoute
