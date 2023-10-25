const express = require("express")
const animeroute = require("./router/anime.route")
const cron = require("node-cron")
const movieroute = require("./router/movie.route")
const { rateLimit } = require("express-rate-limit")

const app = express()
const port = process.env.PORT || "3000"
app.use(express.json())

cron.schedule("*/1 * * * *", () => {
  console.log("run every minutes")
})

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 2,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({
      error: options.message,
    })
  },
})

app.get("/", (req, res) => {
  res.json({
    messege: "api working",
  })
})

app.use("/anime", limiter, animeroute)
app.use("/movie", limiter, movieroute)

app.listen(port, () => {
  console.log("listening in", port)
})
