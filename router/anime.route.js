const { GetByTitle, GetAnimeById, GetEpsByAnimeId, GetAnimeEpisodeById } = require('../api/controller/anime.controller')

const animeroute = require('express').Router()

animeroute.get("/search/:title", GetByTitle)
animeroute.get("/findById",GetAnimeById)
animeroute.get("/episodes", GetEpsByAnimeId)
animeroute.get("/episode/:id", GetAnimeEpisodeById)

module.exports = animeroute


