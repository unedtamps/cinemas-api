const {
  GetMovieName,
  GetMovieEpisodeById,
  GetEpisodeSubs,
  GetMovieTvId,
} = require("../api/controller/movieTv.controller")

const movieroute = require("express").Router()

movieroute.get("/search/:name", GetMovieName)
movieroute.get("/episodes", GetEpisodeSubs)
movieroute.get("/episode/:id", GetMovieEpisodeById)
movieroute.get("/findById", GetMovieTvId)

module.exports = movieroute
