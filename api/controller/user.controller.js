const model = require("../../models")
const bcrypt = require("bcrypt")
const { GenerateKey } = require("../usecase/apikey.usecase")

const user = model.apiKey
const CreateAcc = async (req, res) => {
  const { email, password } = req.body
  if (!validateInput(email, password)) {
    return res.status(400).json({
      error: "Bad Request",
    })
  }
  try {
    const apiKey = GenerateKey()
    const hashPassword = await bcrypt.hash(password, 10)
    if (await user.findOne({ where: { email } })) {
      return res.status(409).json({ error: "User Already Exists" });
    }
    await user.create({
      email,
      password: hashPassword,
      key: apiKey,
      is_premium: false,
    })
    return res.json({
      success: true,
      data: {
        messege: "Success Create Account",
        api_key: apiKey,
      },
    })
  } catch (error) {
    return res.status(500).json({
      error:error.message,
    })
  }
}

const LoginAcc = async (req, res) => {
  const { email, password } = req.body
  if (!validateInput(email, password)) {
    return res.status(400).json({
      error: "Bad Request",
    })
  }

  try {
    const data = await user.findOne({
      where: {
        email,
      },
    })
    if (!data) {
      return res.status(404).json({
        error: "User Not Found",
      })
    }
    if (!(await bcrypt.compare(password, data.dataValues.password))) {
      return res.status(401).json({
        error: "Email or Password Wrong",
      })
    }
    let expireAt = data.dataValues.expire_at
    if (!expireAt || expireAt < Date.now()) {
      expireAt = Date.now() + 24 * 60 * 60 * 1000
    }
    await data.update({
      expire_at: expireAt,
      is_activated: true,
    })
    return res.json({
      success: true,
      data: {
        messege: "Your key is Now Activated",
        expire_at: new Date(expireAt).toString(),
      },
    })
  } catch (error) {
    return res.status(500).json({
      error:error.message,
    })
  }
}

const validateInput = (email, password) => {
  let emailRx =
    '/^(([^<>()\\[\\]\\\\.,;:s@"]+(\\.[^<>()\\[\\]\\\\.,;:s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$/'

  emailRx = new RegExp(emailRx)
  if (emailRx.test(email)) {
    return false
  }
  if (password.length < 8 || password.length > 128) {
    return false
  }
  return true
}
module.exports = { CreateAcc, LoginAcc }
