const path = require("path")
const model = require("../../models")
const userDB = model.user
const process = require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
})
const google = require("googleapis")
const { GenerateKey } = require("./apikey.usecase")

const oauth2Client = new google.Auth.OAuth2Client(
  process.parsed.GOOGLE_CLIENT_ID,
  process.parsed.GOOGLE_CLIENT_SECRET,
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

const updateInsertApiKey = async (data) => {
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
    return user
  } catch (error) {
    console.log(error)
  }
}

module.exports = { authUrl, oauth2Client, updateInsertApiKey }
