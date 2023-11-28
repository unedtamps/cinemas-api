const jwt = require("jsonwebtoken")
const createJwt = (id) => {
  const jwtToken = jwt.sign(
    {
      expire: Math.floor(Date.now() / 1000) * (60 * 60),
      id,
    },
    process.env.SECRET_KEY,
    { algorithm: "HS256" },
  )
  return jwtToken
}
module.exports = createJwt