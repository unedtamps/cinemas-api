const { google } = require("googleapis")
const url = require("url")

const {
  authUrl,
  oauth2Client,
  updateOrCreateUser,
} = require("../usecase/oauth.usecase")

const oauthCallBack = async (req, res) => {
  try {
    const { code } = req.query
    const { tokens } = await oauth2Client.getToken(String(code))

    oauth2Client.setCredentials(tokens)
    const dataInfo = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    })
    const { data } = await dataInfo.userinfo.get()
    if (!data.email) {
      return res.status(404).json({
        message: "data not found",
        name: null,
        expire: null,
      })
    }
    const user = await updateOrCreateUser(data)
    return res.redirect(
      url.format({
        pathname: "/views/response",
        query: {
          message:user.message,
          name: data.name,
          expire_at:user.expire_at
        },
      }),
    )
  } catch (error) {
    return res.status(500).json(error)
  }
}

const outhLogin = (req, res) => {
  res.redirect(authUrl)
}

module.exports = { oauthCallBack, outhLogin }
