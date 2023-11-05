const model = require("../../models")
const userDB = model.user
require("dotenv").config()
const google = require("googleapis")
const { sendEmailActivation } = require("./mail.usecase")
const {
  GenerateKey,
  HashPassword,
  GeneratePassword,
} = require("./utility.usecase")

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
    let response = {}
    const exprireAt = Date.now() + 3 * 24 * 60 * 60 * 1000
    // find not using oauth
    const findUserNotOauth = await userDB.findOne({
      where: {
        email: data.email,
        auth_type: "password",
      },
    })
    if (findUserNotOauth) {
      response = {
        status: 409,
        message: "already register",
      }
      return response
    }
    const findUser = await userDB.findOne({ where: { id: data.id } })
    if (findUser && findUser.dataValues.auth_type === "oauth") {
      await findUser.update({ expire_at: exprireAt })
      response = {
        status: 201,
        message: "update expire date",
        expire_at: new Date(exprireAt).toString(),
      }
      return response
    }
    const key = GenerateKey()
    const password = await HashPassword(GeneratePassword())
    const user = await userDB.create({
      id: data.id,
      name: data.name,
      email: data.email,
      key,
      password,
      auth_type: "oauth",
      expire_at: exprireAt,
    })
    sendEmailActivation(user.dataValues)
    response = {
      status: 201,
      message: "check email to see token and activated token",
    }
    return response
  } catch (error) {
    console.log(error)
  }
}

module.exports = { authUrl, oauth2Client, updateOrCreateUser }
