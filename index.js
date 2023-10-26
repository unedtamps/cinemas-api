const express = require("express")
const animeroute = require("./router/anime.route")
const cron = require("node-cron")
const movieroute = require("./router/movie.route")
const { CreateAcc, LoginAcc } = require("./api/controller/user.controller")
const { rateLimiter, validateKey } = require("./api/middleware/ratelimit")

const app = express()
const port = process.env.PORT || "3000"
app.use(express.json())

cron.schedule("*/1 * * * *", () => {
  console.log("run every minutes")
})

app.get("/", (req, res) => {
  res.json({
    messege: "api working",
  })
})

app.use("/anime", validateKey, rateLimiter, animeroute)
app.use("/movie", validateKey, rateLimiter, movieroute)
// app.get("/key", TestGenrateKey)
app.post("/create_user", CreateAcc)
app.post("/login_user", LoginAcc)

app.listen(port, () => {
  console.log("listening in", port)
})
