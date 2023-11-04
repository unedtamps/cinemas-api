const { customAlphabet } = require("nanoid")
const bcrypt = require("bcrypt")

const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

const GenerateKey = () => {
  const alphabet =
    "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
  const nanoid = customAlphabet(alphabet, 31)
  return nanoid()
}
const GenerateId = () => {
  const alphabet = "1234567890"
  const nanoid = customAlphabet(alphabet, 21)
  return nanoid()
}

const GeneratePassword = () => {
  const alphabet =
    "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz*!@#$%^&*"
  const password = customAlphabet(alphabet, 31)
  return password()
}
const HashPassword = async (plainPass) => {
  const hash = await bcrypt.hash(plainPass, 10)
  return hash
}
const Compare = async (plainPass, hased) => {
  const compare = await bcrypt.compare(plainPass, hased)
  return compare
}

module.exports = {
  toTitleCase,
  GenerateKey,
  GeneratePassword,
  HashPassword,
  Compare,
  GenerateId,
}
