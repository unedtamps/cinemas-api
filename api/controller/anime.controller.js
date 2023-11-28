const { BaseError } = require("../handler/error.handler")
const paginationHendler = require("../handler/pagination.hendler")
const { SuccesResponse } = require("../handler/succes.handler")
const {
  SearchFromApi,
  SearchEpisodeApi,
  SearchEpisodesApi,
  FindAnimeById,
  FindAnimeByTitle,
  FindEpisodesByAnimeId,
  FindAnimeEpisodeById,
} = require("../usecase/anime.usecase")

const GetAnimeById = async (req, res, next) => {
  const id = req.params.id
  try {
    const data = await FindAnimeById(id)
    if (!data) {
      SearchFromApi(id)
      throw new BaseError("Anime Not Found, Try Again Letter", 404)
    }
    const response = new SuccesResponse("Success Get Anime", data)
    response.succes200(res)
  } catch (error) {
    next(new BaseError(error.message, error.statusCode))
  }
}

const GetAnimeByTitle = async (req, res, next) => {
  const title = req.params.title
  const { page, perPage } = req.query
  const { limit, offset } = paginationHendler(page, perPage)
  try {
    const datas = await FindAnimeByTitle(title, limit, offset)
    if (datas.length === 0) {
      SearchFromApi(title)
      throw new BaseError("Anime Not Found, Try Again Letter", 404)
    }
    const response = new SuccesResponse("Success Get Anime", {
      page,
      dataPage: datas.length,
      datas,
    })
    response.succes200(res)
  } catch (error) {
    next(new BaseError(error.message, error.statusCode))
  }
}

const GetEpsByAnimeId = async (req, res, next) => {
  const animeId = req.params.anime_id
  try {
    // check if anime is in table in not in table put it to table first
    const checkAnime = await FindAnimeById(animeId)
    if (!checkAnime) {
      SearchFromApi(animeId)
      throw new BaseError("Anime Not Found, Try Again Letter", 404)
    }

    // now anime are in table or anime are not found
    const datas = await FindEpisodesByAnimeId(animeId)
    if (datas.length === 0) {
      SearchEpisodesApi(animeId)
      throw new BaseError("Episodes Not Found, Try Again Letter", 404)
    }
    const response = new SuccesResponse("Success Get Episodes", datas)
    response.succes200(res)
  } catch (error) {
    next(new BaseError(error.message, error.statusCode))
  }
}

const GetAnimeEpisodeById = async (req, res, next) => {
  const id = req.params.id
  try {
    let animeId = id.split("-")
    animeId.pop()
    animeId.pop()
    animeId = animeId.join("-")
    const anime = await FindAnimeById(animeId)
    if (!anime) {
      ;(async () => {
        await SearchFromApi(animeId)
        SearchEpisodeApi(id, animeId)
      })()
      throw new BaseError("Anime Not Found, Try Again Letter", 404)
    }
    const datas = await FindAnimeEpisodeById(id)
    if (datas.length === 0) {
      SearchEpisodeApi(id, animeId)
      throw new BaseError("Episodes Not Found, Try Again Letter", 404)
    }
    const response = new SuccesResponse("Success Get Episode", datas)
    response.succes200(res)
  } catch (error) {
    next(new BaseError(error.message, error.statusCode))
  }
}


module.exports = {
  GetAnimeById,
  GetAnimeByTitle,
  GetEpsByAnimeId,
  GetAnimeEpisodeById,
}
