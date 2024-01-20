const GetMovieTvSubtitles = require("../api/controller/movie_tv.controller")
const {
  GetTvName,
  GetTvById,
  GetTvEpisodes,
  GetTvEpisodeById,
} = require("../api/controller/tv.controller")

const tvroute = require("express").Router()

tvroute.get("/search/:name", GetTvName)
tvroute.get("/", GetTvById)
tvroute.get("/episodes", GetTvEpisodes)
tvroute.get("/episode/:id", GetTvEpisodeById)
tvroute.get("/episode/subtitle/:id", GetMovieTvSubtitles)

module.exports = tvroute

