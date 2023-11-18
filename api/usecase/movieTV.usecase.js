const model = require("../../models")
const movie = model.movie
const tv = model.tv
const mwatch = model.movieWatch
const subs = model.subtitles
const tvEps = model.tvWatch
require("dotenv").config()
const { Op } = require("sequelize")
const { toTitleCase } = require("./utility.usecase")
const { MOVIES } = require('@consumet/extensions')
const flixhq = new MOVIES.FlixHQ()


// movie
const FindMovieByName = async (name) => {
  try {
    const datas = await movie.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${toTitleCase(name)}%`,
            },
          },
          {
            id: {
              [Op.like]: `%${name}%`,
            },
          },
        ],
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
const FindMovieById = async (id) => {
  try {
    let data = await movie.findOne({
      attributes: { exclude: ["createdAt", "updatedAt"] },
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

const FindEpisodeByMovieId = async (movieId) => {
  try {
    const datas = await mwatch.findAll({
      attributes: { exclude: "movieId" },
      where: {
        movie_id: movieId,
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
const FindEpisodeMovieById = async (id) => {
  try {
    const datas = await mwatch.findAll({
      attributes: { exclude: "movieId" },
      where: {
        id,
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

// Tv
const FindTvByName = async (name) => {
  try {
    const datas = await tv.findAll({
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
    console.log(error.message)
  }
}
const FindTvById = async (id) => {
  try {
    let data = await tv.findOne({
      where: {
        id,
      },
    })
    if (data) {
      data = data.dataValues
    }
    return data
  } catch (error) {
    console.log(error.message)
  }
}

const FindEpisodesByTVId = async (tvId) => {
  try {
    const datas = await tvEps.findAll({
      attributes: { exclude: "tvId" },
      where: {
        tv_id: tvId,
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

// Apis
const SearchMovieTVAPI = async (name) => {
  try {
    const { results } = await flixhq.search(name)
    if (results.length === 0) {
      console.log(`${name} Not Found`)
      return
    }
    await Promise.all(
      results.map(async (data) => {
        const getJson = await flixhq.fetchMediaInfo(data.id)
        if (!getJson) {
          console.log(`${name} Detail Info Is Not Found`)
          return
        }
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
  } catch (error) {
    console.log(error.message)
  }
}

const GetMovieTVEpsApi = async (Id, type) => {
  try {
    const tempId = Id.split("-")
    const watchId = tempId.pop()
    const server = await flixhq.fetchEpisodeServers(watchId, Id)
    if (server.length === 0) {
      console.log(`Server Not Available`)
      return
    }
    let watchJson
    for (const s of server) {
      try {
        const res = await flixhq.fetchEpisodeSources(watchId,Id,s.name)
        watchJson = res.sources
        if (watchJson) break
      } catch (error) {console.log(error.message, s.name)}
    }
    if (watchJson == null) {
      console.log(Id, "is not found")
      return
    }
    // insert epsiosde of movie to db and return
    InsertMovieTVEpisode(watchJson, watchId, Id, type)
    // insert to subtitle db
    InsertMovieTVSubtitle(watchJson, watchId)
  } catch (error) {
    console.log(error.message)
  }
}

const InsertMovieTVEpisode = async (dataEps, id, movieTVId, type) => {
  try {
    let title = ""

    if (type === "tv") {
      const { episodes } = await flixhq.fetchMediaInfo(movieTVId)
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

const InsertMovieTVSubtitle = async (dataSub, id) => {
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

const FindSubtitleById = async (id) => {
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
module.exports = {
  SearchMovieTVAPI,
  GetMovieTVEpsApi,
  FindSubtitleById,
  FindMovieByName,
  FindEpisodeByMovieId,
  FindEpisodeMovieById,
  FindMovieById,
  FindTvByName,
  FindTvById,
  FindEpisodesByTVId,
}
