const { GetMovieName, GetEpisodeSubs } = require('../api/controller/movie.controller')

const movieroute = require('express').Router()


movieroute.get("/search", GetMovieName)
movieroute.get("/episode", GetEpisodeSubs)



module.exports = movieroute