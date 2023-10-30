const model = require("../../models")
const userModel = model.user
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

module.exports = { validateInput, activatedUser }
