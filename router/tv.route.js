const {GetEpisodeSubs, GetMovieTvId ,GetTvName } = require('../api/controller/movieTv.controller')

const tvroute = require('express').Router()

tvroute.get("/search/:name", GetTvName)
tvroute.get("/findById", GetMovieTvId)
tvroute.get("/episodes", GetEpisodeSubs)


module.exports = tvroute