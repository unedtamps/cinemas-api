const model = require("../../models")
const userDB = model.user
require('dotenv').config()
const google = require("googleapis")
const { GenerateKey } = require("./apikey.usecase")
const { sendEmailActivation } = require("./mail.usecase")

const oauth2Client = new google.Auth.OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:8080/auth/google/callback",
)

const scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
]

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
  include_granted_scopes: true,
})

const updateOrCreateUser = async (data) => {
  try {
    const exprireAt = Date.now() + 3 * 24 * 60 * 60 * 1000
    const findUser = await userDB.findOne({ where: { id: data.id } })
    if (findUser) {
      await findUser.update({ expire_at: exprireAt })
      return findUser
    }
    const key = GenerateKey()
    const user = await userDB.create({
      id: data.id,
      name: data.name,
      email: data.email,
      key,
      expire_at: exprireAt,
    })
    sendEmailActivation(user.dataValues)
    return user
  } catch (error) {
    console.log(error)
  }
}

module.exports = { authUrl, oauth2Client, updateOrCreateUser }
