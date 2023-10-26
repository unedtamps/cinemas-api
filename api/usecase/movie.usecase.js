const { Op } = require("sequelize")
const model = require("../../models")
const movie = model.movie
const mwatch = model.movieWatch
const subs = model.subtitles

const MovieFromApi = async (name) => {

  let url = `http://localhost:3000/movies/flixhq/${name}`
  
  const results = []
  try {
    const dataFetch = await fetch(url)
    const datas = await dataFetch.json()
    const dataRes = datas.results
    await Promise.all(
      dataRes.map(async (data) => {
        url = `http://localhost:3000/movies/flixhq/info?id=${data.id}`
        const getInfo = await fetch(url)
        const getJson = await getInfo.json()
        // insert to movie table
        const genres = getJson.genres ? getJson.genres.join(",") : null
        const casts = getJson.casts ? getJson.casts.join(",") : null
        const duration = getJson.duration
          ? parseInt(getJson.duration.split(" ")[0])
          : 0
        if (data.type === "Movie" && duration !== 0) {
          const result = {
            id: data.id,
            title: data.title,
            image: data.image,
            cover: getJson.cover,
            release_date: getJson.releaseDate,
            description: getJson.description,
            genres,
            cast: casts,
            production: getJson.production,
            country: getJson.country,
            duration,
            rating: getJson.rating,
          }
          movie.upsert(result)
          results.push(result)
        }
      }),
    )
    return results
  } catch (error) {
    throw new Error(error)
  }
}

const GetMovieEpsApi = async (movieId) => {
  try {
    const tempId = movieId.split("-")
    const watchId = tempId.pop()

    const url = "http://localhost:3000/movies/flixhq/watch?"
    const watchData = await fetch(
      url +
        new URLSearchParams({
          episodeId: watchId,
          mediaId: movieId,
        }),
    )
    const watchJson = await watchData.json()
    // insert epsiosde of movie to db and return
    const epsDatas = await InsertMovieEpisode(watchJson, watchId, movieId)
    // insert to subtitle db
    const subDatas = await InsertMovieSubtitle(watchJson, watchId)
    const response = {
      epsisodes: epsDatas,
      subtitles: subDatas,
    }
    return response
  } catch (error) {
    throw new Error(error)
  }
}

const InsertMovieEpisode = async (dataEps, id, movieId) => {
  const epsResults = []
  try {
    dataEps.sources.forEach(async (eps) => {
      const epsDAta = {
        id,
        watch_url: eps.url,
        quality: eps.quality,
        movie_id: movieId,
      }
      if (eps.quality === "1080" || eps.quality === "auto") {
        epsResults.push(epsDAta)
        mwatch.upsert(epsDAta)
      }
    })
    return epsResults
  } catch (error) {
    throw new Error(error)
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
    throw new Error(error)
  }
}
const GetMovieByName = async (name) => {
  try {
    const datas = await movie.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: {
        title: {
          [Op.like]: `%${name}%`,
        },
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
    throw new Error(error)
  }
}
const GetMovieById = async (id) => {
  try {
    let data = await movie.findOne({
      where: {
        id,
      },
    })
    if (data) {
      data = data.dataValues
    }
    return data
  } catch (error) {
    throw new Error(error)
  }
}

const GetEpisodeMovieById = async (id) => {
  try {
    const datas = await mwatch.findAll({
      attributes: { exclude: "movieId" },
      where: {
        movie_id: id,
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
    throw new Error(error)
  }
}
const GetSubtitleById = async (id) => {
  try {
    const datas = await subs.findAll({
      where: {
        episode_id:id,
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
    throw new Error(error)
  }
}

module.exports = {
  MovieFromApi,
  GetMovieEpsApi,
  GetMovieByName,
  GetMovieById,
  GetEpisodeMovieById,
  GetSubtitleById,
  InsertMovieSubtitle
}
