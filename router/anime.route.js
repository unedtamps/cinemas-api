const { GetTitle, GetAnime, GetEpisode, GetEpisodes } = require('../api/controller/anime.controller')

const animeroute = require('express').Router()

animeroute.get("/search/:title", GetTitle)
animeroute.get("/find/:id",GetAnime)
animeroute.get("/episodes/:anime_id", GetEpisodes)
animeroute.get("/episode/:id", GetEpisode)

module.exports = animeroute


