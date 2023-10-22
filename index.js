const express = require("express")
const animeroute = require("./router/anime.route")

const app = express()
const port = process.env.PORT || "3000"
app.use(express.json())

app.get("/", (req, res) => {
  res.json({
    messege: "api working",
  })
})

app.use("/anime",animeroute)


app.listen(port, () => {
    console.log("listening in", port)
})