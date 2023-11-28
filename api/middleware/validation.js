const jwt = require("jsonwebtoken")
const { findUserToken } = require("../usecase/oauth.usecase")
const { BaseError } = require("../handler/error.handler")
require("dotenv").config()

const validateUser = async (req, res, next) => {
  const jwtToken = req.query.token
  try {
    const payload = jwt.verify(jwtToken, process.env.SECRET_KEY)
    const { token, expire, name } = await findUserToken(payload.id)
    req.token = token
    req.expire = expire
    req.name = name
    req.id = payload.id
    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new BaseError(error.message, 401))
    }
    next(new BaseError(error.message, 500))
  }
}

module.exports = { validateUser }
