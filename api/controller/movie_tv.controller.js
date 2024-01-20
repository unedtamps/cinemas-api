const { BaseError } = require("../handler/error.handler")
const { SuccesResponse } = require("../handler/succes.handler")
const { FindSubtitleById } = require("../usecase/movieTV.usecase")

const GetMovieTvSubtitles = async (req, res, next) => {
  const id = req.params.id
  try {
    const data = await FindSubtitleById(id)
    if (data.length === 0) {
      throw new BaseError("Tv episode not found", 404)
    }
    const response = new SuccesResponse("Success Get Movie", data)
    response.succes200(res)
  } catch (error) {
    next(new BaseError(error.message, error.statusCode))
  }
}
module.exports = GetMovieTvSubtitles
