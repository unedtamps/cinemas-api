const {customAlphabet } = require('nanoid')

const GenerateKey = () => {
  const alphabet =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
  const nanoid = customAlphabet(alphabet, 32)
  return nanoid()
}

module.exports = { GenerateKey }
