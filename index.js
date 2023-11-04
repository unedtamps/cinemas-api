const express = require("express")
const animeroute = require("./router/anime.route")
const cron = require("node-cron")
const cors = require("cors")
const movieroute = require("./router/movie.route")
const { rateLimiter, validateKey } = require("./api/middleware/ratelimit")
const tvroute = require("./router/tv.route")
const authroute = require("./router/auth.route")

const app = express()
const port = process.env.PORT || "3000"
app.use(express.static('public'))
app.use(express.json())
app.use(
  cors({
    origin: "*",
  }),
)
app.set("view engine", "ejs")

cron.schedule("*/1 * * * *", () => {
  console.log("run every minutes")
})

app.get("/", (req, res) => {
  res.json({
    messege: "api working",
  })
})

app.get('/login', (req, res) => {
  res.render('login.page.ejs', {title:"Login | Cinema"})
})
app.get('/register', (req, res) => {
  res.render('register.page.ejs', {title:"Register | Cinema"})
})

app.use("/anime", validateKey, rateLimiter, animeroute)
app.use("/movie", validateKey, rateLimiter, movieroute)
app.use("/tv", validateKey, rateLimiter, tvroute)
app.use("/auth", authroute)
// app.post("/create_user", CreateAcc)
// app.post("/login_user", LoginAcc)

app.listen(port, () => {
  console.log("listening in", port)
})
