const { BaseError } = require("../handler/error.handler")
const { SuccesResponse } = require("../handler/succes.handler")
const {
  GetMovieByName,
  GetEpisodeById,
  GetMovieById,
} = require("../usecase/movie.usecase")
const {
  FindEpisodeByMovieId,
  SearchMovieTVAPI,
} = require("../usecase/movieTV.usecase")

const FindMovieById = async (req, res, next) => {
  const id = req.query.id
  try {
    const data = await GetMovieById(id)
    if (!data) {
      let name = id.split("/")
      name = name[1]
      SearchMovieTVAPI(name)
      throw new BaseError("Movie Not Found, Try Again Letter", 404)
    }

    const response = new SuccesResponse("Success Get Movie", data)
    response.succes200(res)
  } catch (error) {
    next(new BaseError(error.message, error.statusCode))
  }
}

const GetMovieName = async (req, res, next) => {
  const name = req.params.name
  try {
    const datas = await GetMovieByName(name)
    if (datas.length === 0) {
      SearchMovieTVAPI(name)
      throw new BaseError("Movie Not Found, Try Again Letter")
    }
    const response = new SuccesResponse("Success Get Movie", datas)
    response.succes200(res)
  } catch (error) {
    next(new BaseError(error.message, error.statusCode))
  }
}

const GetMovieEpisodeById = async (req, res, next) => {
  const id = req.params.id
  try {
    const episode = await GetEpisodeById(id)
    if (episode) {
      throw new BaseError("Episode Not Found", 404)
    }
    const response = new SuccesResponse("Success Get Movie Episode", episode)
    response.succes200(res)
  } catch (error) {
    next(new BaseError(error.message, error.statusCode))
  }
}
const GetMovieEpisodes = async (req, res, next) => {
  const { id } = req.query
  try {
    const Eps = await FindEpisodeByMovieId(id)
    if (Eps === null || Eps === undefined) {
      let name = id.split("/")
      name = name[1]
      SearchMovieTVAPI(name)
      throw new BaseError("Movie Eps Not Found", 404)
    }
    const response = new SuccesResponse("Success Get Movie Episodes", Eps)
    response.succes200(res)
  } catch (error) {
    next(new BaseError(error.message, error.statusCode))
  }
}

module.exports = {
  GetMovieName,
  GetMovieEpisodeById,
  GetMovieEpisodes,
  FindMovieById,
}
