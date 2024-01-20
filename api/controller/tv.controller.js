const { BaseError } = require("../handler/error.handler")
const { SuccesResponse } = require("../handler/succes.handler")
const { SearchMovieTVAPI } = require("../usecase/movieTV.usecase")
const {
  GetTvByIdDB,
  GetTvByName,
  GetEpisodeTvById,
  FindEpisodeById,
} = require("../usecase/tv.usecase")

const GetTvName = async (req, res, next) => {
  try {
    const name = req.params.name
    const datas = await GetTvByName(name)
    if (datas.length === 0) {
      SearchMovieTVAPI(name)
      throw new BaseError("Tv series not found", 404)
    }
    const response = new SuccesResponse("Success Get Tv", datas)
    response.succes200(res)
  } catch (error) {
    next(new BaseError(error.message, error.statusCode))
  }
}
const GetTvById = async (req, res, next) => {
  const id = req.query.id
  try {
    const data = await GetTvByIdDB(id)
    if (!data) {
      let name = id.split("/")
      name = name[1]
      SearchMovieTVAPI(name)
      throw new BaseError("Tv series not found", 404)
    }
    const response = new SuccesResponse("Success Get Tv", data)
    response.succes200(res)
  } catch (error) {
    next(new BaseError(error.message, error.statusCode))
  }
}

const GetTvEpisodes = async (req, res, next) => {
  const id = req.query.id
  try {
    const datas = await GetEpisodeTvById(id)
    if (datas.length === 0) {
      let name = id.split("/")
      name = name[1]
      SearchMovieTVAPI(name)
      throw new BaseError("Tv episodes not found", 404)
    }
    const response = new SuccesResponse("Succes To Get Tv Episodes", datas)
    response.succes200(res)
  } catch (error) {
    next(new BaseError(error.message, error.statusCode))
  }
}

const GetTvEpisodeById = async (req, res, next) => {
  const id = req.params.id
  try {
    const data = await FindEpisodeById(id)
    if (!data) {
      throw new BaseError("Tv episode not found", 404)
    }
    const response = new SuccesResponse("Succes To Get Tv Episodes", data)
    response.succes200(res)
  } catch (error) {
    next(new BaseError(error.message, error.statusCode))
  }
}

module.exports = { GetTvName, GetTvById, GetTvEpisodes, GetTvEpisodeById }
