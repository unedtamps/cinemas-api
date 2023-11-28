const {
  oauthCallBack,
  outhLogin,
} = require("../api/controller/oauth.controller")
const {
  activatedUser,
  registerUser,
  loginUser,
} = require("../api/controller/user.controller")

const authroute = require("express").Router()

authroute.get("/google/callback", oauthCallBack)
authroute.get("/google", outhLogin)
authroute.post("/user/activated", activatedUser)

authroute.post("/register", registerUser)
authroute.post("/login", loginUser)


module.exports = authroute
