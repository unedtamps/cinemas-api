const express = require("express")
const animeroute = require("./router/anime.route")
const cron = require("node-cron")
const cors = require("cors")
const movieroute = require("./router/movie.route")
const { activatedUser } = require("./api/controller/user.controller")
const { rateLimiter, validateKey } = require("./api/middleware/ratelimit")
const tvroute = require("./router/tv.route")
const {
  oauthCallBack,
  outhLogin,
} = require("./api/controller/oauth.controller")

const app = express()
const port = process.env.PORT || "3000"
app.use(express.json())
app.use(
  cors({
    origin: "*",
  }),
)
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
app.use("/tv", validateKey, rateLimiter, tvroute)
app.get("/auth/google/callback", oauthCallBack)
app.get("/auth/google", outhLogin)
app.post("/user/activated", activatedUser)

// app.post("/create_user", CreateAcc)
// app.post("/login_user", LoginAcc)

app.listen(port, () => {
  console.log("listening in", port)
})
