const model = require("../../models")
const movie = model.movie
const tv = model.tv
const mwatch = model.movieWatch
const subs = model.subtitles
const tvEps = model.tvWatch
const { MOVIES } = require("@consumet/extensions")
const flixHq = new MOVIES.FlixHQ()
require('dotenv').config()
const apiUrl = process.env.API_URL


const SearchMovieTVAPI = async (name) => {
  // let url = `${apiUrl}/movies/flixhq/${name}`
  const results = []
  try {
    // const dataFetch = await fetch(url)
    // const datas = await dataFetch.json()
    const datas = await flixHq.search(name, 1)
    const dataRes = datas.results

    await Promise.all(
      dataRes.map(async (data) => {
        // url = `${apiUrl}/movies/flixhq/info?id=${data.id}`
        // const getInfo = await fetch(url)
        // const getJson = await getInfo.json()
        const getJson = await flixHq.fetchMediaInfo(data.id)
        // insert to movie table

        const genres = getJson.genres ? getJson.genres.join(",") : null
        const casts = getJson.casts ? getJson.casts.join(",") : null
        const duration = getJson.duration
          ? parseInt(getJson.duration.split(" ")[0])
          : 0
        const result = {
          id: data.id,
          title: data.title,
          image: data.image,
          release_date: getJson.releaseDate,
          description: getJson.description,
          genres,
          cast: casts,
          production: getJson.production,
          country: getJson.country,
          duration,
          rating: getJson.rating || 0,
        }
        if (data.type === "Movie" && duration !== 0) {
          result.cover = getJson.cover
          movie.upsert(result)
        } else if (data.type === "TV Series" && duration !== 0) {
          const len = getJson.episodes.length || 0
          result.total_episode = len
          result.total_season = getJson.episodes[len - 1]
            ? getJson.episodes[len - 1].season
            : 0
          tv.upsert(result)
        }
      }),
    )
    return results
  } catch (error) {
    console.log(error.message)
  }
}

const GetMovieTVEpsApi = async (Id, type) => {
  try {
    const tempId = Id.split("-")
    const watchId = tempId.pop()
    // const server = await flixHq.fetchEpisodeServers(watchId, Id)
    // if (server.length === 0) {
    //   return
    // }
    // const serverName = server[0].name

    // const watchJson = await flixHq.fetchEpisodeSources(watchId, Id, serverName)
    const url = `${apiUrl}/movies/flixhq/watch?`
    const watchData = await fetch(
      url +
        new URLSearchParams({
          episodeId: watchId,
          mediaId: Id,
        }),
    )
    const watchJson = await watchData.json()
    if(watchJson.sources === undefined){
      console.log(`Episode ${Id} not found`)
      return
    }
    // insert epsiosde of movie to db and return
    InsertMovieEpisode(watchJson, watchId, Id, type)
    // insert to subtitle db
    InsertMovieSubtitle(watchJson, watchId)
  } catch (error) {
    console.log(error.message)
  }
}

const InsertMovieEpisode = async (dataEps, id, movieTVId, type) => {
  try {
    let title = ""

    if (type === "tv") {
      // const url = `${apiUrl}/movies/flixhq/info?id=${movieTVId}`
      // const getInfo = await fetch(url)
      // const getJson = await getInfo.json()
      const getJson = await flixHq.fetchMediaInfo(movieTVId)
      const episodes = getJson.episodes
      title = episodes.title
    }
    dataEps.sources.forEach(async (eps) => {
      const epsDAta = {
        id,
        watch_url: eps.url,
        quality: eps.quality,
      }
      if (eps.quality === "1080" || eps.quality === "auto") {
        if (type === "movie") {
          epsDAta.movie_id = movieTVId
          mwatch.upsert(epsDAta)
        } else {
          epsDAta.title = title
          epsDAta.tv_id = movieTVId
          tvEps.upsert(epsDAta)
        }
      }
    })
  } catch (error) {
    console.log(error.message)
  }
}

const InsertMovieSubtitle = async (dataSub, id) => {
  // insert subtitle to db
  const subsDatas = []
  try {
    dataSub.subtitles.forEach(async (sub) => {
      const subData = {
        episode_id: id,
        url_sub: sub.url,
        lang: sub.lang,
      }
      subs.upsert(subData)
      subsDatas.push(subData)
    })
    return subsDatas
  } catch (error) {
    console.log(error.message)
  }
}

const GetSubtitleById = async (id) => {
  try {
    const datas = await subs.findAll({
      where: {
        episode_id: id,
      },
    })
    const results = []
    if (datas) {
      datas.forEach((data) => {
        results.push(data.dataValues)
      })
    }
    return results
  } catch (error) {
    console.log(error.message)
  }
}
module.exports = { SearchMovieTVAPI, GetMovieTVEpsApi, GetSubtitleById }
