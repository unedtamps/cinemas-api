const express = require("express")
const animeroute = require("./router/anime.route")
const cron = require("node-cron")
const cors = require("cors")
const movieroute = require("./router/movie.route")
const { rateLimiter, validateKey } = require("./api/middleware/ratelimit")
const tvroute = require("./router/tv.route")
const authroute = require("./router/auth.route")
const viewRoute = require("./router/view.route")
const bodyParser = require("body-parser")
const { SuccesResponse } = require("./api/handler/succes.handler")
const { UpdateRecentEps } = require("./api/usecase/anime.usecase")
const app = express()
const port = process.env.PORT || "3000"
app.use(express.static("public"))
app.use(express.json())
app.use(
  cors({
    origin: "*",
  }),
)

app.get("/", validateKey, (req, res) => {
  const response = new SuccesResponse("pingsucess")
  response.succes200(res)
})

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true }))

cron.schedule("* * * * * 0", () => {
  UpdateRecentEps()
})

app.use("/anime", validateKey, rateLimiter, animeroute)
app.use("/movie", validateKey, rateLimiter, movieroute)
app.use("/tv", validateKey, rateLimiter, tvroute)
app.use("/auth", authroute)
app.use("/views", viewRoute)

app.use("/error", (req, res) => {
  return res.render("error.page.ejs", { message: req.query.message })
})

app.use((err, req, res, next) => {
  const { message, statusCode } = err
  return res.status(statusCode).json({
    success: false,
    message,
  })
})

app.use((req, res) => {
  return res.render("home.page.ejs", { title: "Home | Cinema" })
})

app.listen(port, () => {
  console.log("listening in", port)
})
