const {
  GetMovieName,
  GetMovieEpisodes,
  GetMovieEpisodeById,
  FindMovieById,
} = require("../api/controller/movie.controller")
const GetMovieTvSubtitles = require("../api/controller/movie_tv.controller")

const movieroute = require("express").Router()

movieroute.get("/search/:name", GetMovieName)
movieroute.get("/episodes", GetMovieEpisodes)
movieroute.get("/episode/:id", GetMovieEpisodeById)
movieroute.get("/episode/subtitle/:id", GetMovieTvSubtitles)
movieroute.get("/", FindMovieById)

module.exports = movieroute
