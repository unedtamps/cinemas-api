const { rateLimit } = require("express-rate-limit")
const IP = require("ip")
const model = require("../../models")
const KeyApi = model.apiKey
const ip = IP.address()

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skip: async (req, res, next) => {
    const isPremium = res.locals.premium
    if (!isPremium) {
      return false
    }
    return ip
  },
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({
      message: options.message,
    })
  },
})

const validateKey = async (req, res, next) => {
  const key = decodeURIComponent(req.query.API_KEY)
  console.log(key)
  try {
    if (!key) {
      return res.status(400).json({
        error: "Bad request, No Api Key",
      })
    }
    const data = await KeyApi.findOne({ where: { key } })
    if (!data) {
      return res.status(404).json({
        error: "Api Key Not Found",
      })
    }
    if(!data.dataValues.is_activated){
      return res.status(403).json({
        error: "Api not Active, Please Login First",
      })
    }
    res.locals.premium = data.dataValues.is_premium
    next()
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    })
  }
}

module.exports = { rateLimiter, validateKey }
