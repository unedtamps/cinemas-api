const {GetEpisodeSubs, GetMovieTvId} = require('../api/controller/movietv.controller')
const { GetTvName } = require('../api/controller/tv.controller')

const tvroute = require('express').Router()

tvroute.get("/search/:name", GetTvName)
tvroute.get("/findById", GetMovieTvId)
tvroute.get("/episodes", GetEpisodeSubs)


module.exports = tvroute