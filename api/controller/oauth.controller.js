const { google } = require("googleapis")

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
    console.log(data.name)
    if (!data.email) {
      return res.status(404).json({
        message: "data not found",
      })
    }
    const user = await updateOrCreateUser(data)
    if (!user) {
      return res.status(409).json({
        success: false,
        message: "already exisits",
      })
    }

    return res.status(201).json({
      success: true,
      data: {
        apiKey: user.dataValues.key,
        expire_at: new Date(user.dataValues.expire_at).toString(),
      },
    })
  } catch (error) {
    return res.status(500).json(error)
  }
}

const outhLogin = (req, res) => {
  res.redirect(authUrl)
}

module.exports = { oauthCallBack, outhLogin }
