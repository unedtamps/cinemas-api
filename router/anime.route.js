const {GetAnimeById, GetEpsByAnimeId, GetAnimeEpisodeById, GetAnimeByTitle } = require('../api/controller/anime.controller')

const animeroute = require('express').Router()

animeroute.get("/search/:title", GetAnimeByTitle)
animeroute.get("/get-by-id/:id",GetAnimeById)
animeroute.get("/episodes/:anime_id", GetEpsByAnimeId)
animeroute.get("/episode/:id", GetAnimeEpisodeById)

module.exports = animeroute


