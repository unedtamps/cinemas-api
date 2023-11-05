const model = require("../../models")
const { sendEmailActivation } = require("../usecase/mail.usecase")
const {
  GenerateId,
  HashPassword,
  GenerateKey,
  Compare,
} = require("../usecase/utility.usecase")
const userModel = model.user
const url = require("url")
const validateInput = (email, password) => {
  if (!password || !email) {
    return false
  }
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

const activatedUser = async (req, res) => {
  try {
    const id = req.query.id
    await userModel.update(
      { is_activated: true },
      {
        where: {
          id,
        },
      },
    )
    res.redirect("/")
  } catch (error) {
    console.log(error)
  }
}

const registerUser = async (req, res) => {
  console.log(req)
  const { email, password, name } = req.body
  console.log(email, password, name)
  try {
    if (!validateInput(email, password)) {
      return res.status(400).json({
        success: false,
        message: "bad request",
      })
    }
    const userFind = await userModel.findOne({
      where: {
        email,
      },
    })
    if (userFind) {
      return res.status(400).json({
        success: false,
        message: "already exsist",
      })
    }
    const user = await userModel.create({
      id: GenerateId(),
      email,
      password: await HashPassword(password),
      name,
      key: GenerateKey(),
      auth_type: "password",
      expire_at: Date.now() + 3 * 24 * 60 * 60 * 1000,
    })
    sendEmailActivation(user.dataValues)
    return res.redirect(
      url.format({
        pathname: "/views/response",
        query: {
          success: true,
          status:201,
          message: "success create user chack email for token and activation",
        },
      }),
    )
  } catch (error) {
    console.log(error.message)
  }
}
const loginUser = async (req, res) => {
  const { email, password } = req.query
  try {
    if (!validateInput(email, password)) {
      return res.status(400).json({
        success: false,
        message: "bad request",
      })
    }
    const userFind = await userModel.findOne({
      where: {
        email,
      },
    })
    if (!userFind) {
      return res.status(404).json({
        success: false,
        message: "email or password wrong",
      })
    }
    const comparePass = await Compare(password, userFind.dataValues.password)
    if (!comparePass) {
      return res.status(403).json({
        success: false,
        message: "email or password wrong",
      })
    }

    const expireAt = Date.now() + 3 * 24 * 60 * 60 * 1000
    await userFind.update({
      expire_at: expireAt,
    })
    return res.redirect(
      url.format({
        pathname: "/views/response",
        query: {
          success: true,
          status:201,
          message: "success update expire date",
        },
      }),
    )
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = { validateInput, activatedUser, registerUser, loginUser }
