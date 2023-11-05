const viewRoute = require("express").Router()

viewRoute.get("/login", (req, res) => {
  return res.render("login.page.ejs", { title: "Login | Cinema" , link:process.env.APP_URL })
})

viewRoute.get("/register", (req, res) => {
  return res.render("register.page.ejs", { title: "Register | Cinema", link:process.env.APP_URL })
})

viewRoute.get("/response", (req, res) => {
  const response = req.query
  return res.status(parseInt(response.status)).json(response)
})

module.exports = viewRoute
