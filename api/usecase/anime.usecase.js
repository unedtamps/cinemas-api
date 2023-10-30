const { Op } = require("sequelize")
const model = require("../../models")
const toTitleCase = require("./utility.usecase")
const anime = model.anime
const episode = model.animeEpisode
require("dotenv").config()
const apiUrl = process.env.API_URL

const GetbyId = async (id) => {
  try {
    let data = await anime.findOne({
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
    console.log(error.message)
  }
}
const GetByName = async (name) => {
  try {
    const datas = await anime.findAll({
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

const GetEpisodesByAnimeId = async (animeId) => {
  try {
    const datas = await episode.findAll({
      attributes: ["id", "quality", "anime_id", "episode_url"],
      where: {
        anime_id: animeId,
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
const GetEpisodeId = async (id) => {
  try {
    const datas = await episode.findAll({
      attributes: ["id", "quality", "anime_id", "episode_url"],
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

const SearchFromApi = async (title) => {
  try {
    let url = `${apiUrl}/anime/gogoanime/${title}`
    let data = await fetch(url)
    const dataWait = await data.json()
    const jsonDatas = dataWait.results
    await Promise.all(
      jsonDatas.map(async (js) => {
        url = `${apiUrl}/anime/gogoanime/info/${js.id}`
        data = await fetch(url)
        const getJson = await data.json()
        const result = {
          id: js.id,
          title: js.title,
          genres: getJson.genres.join(","),
          release_year: getJson.releaseDate,
          image: js.image,
          total_episode: getJson.totalEpisodes,
          description: getJson.description,
          sub_or_dub: js.subOrDub,
          status: getJson.status,
          type: getJson.type,
        }
        anime.upsert(result)
      }),
    )
  } catch (error) {
    console.log(error.message)
  }
}
const SearchEpisodesApi = async (animeId) => {
  try {
    const url = `${apiUrl}/anime/gogoanime/info/${animeId}`
    const data = await fetch(url)
    const infoJson = await data.json()
    const episodes = infoJson.episodes
    await Promise.all(
      episodes.map(async (ep) => {
        SearchEpisodeApi(ep.id, animeId)
      }),
    )
  } catch (error) {
    console.log(error.message)
  }
}

const SearchEpisodeApi = async (id, animeId) => {
  try {
    const url = `${apiUrl}/anime/gogoanime/watch/${id}`
    const datas = await fetch(url)
    const dataJson = await datas.json()
    const dataRes = dataJson.sources
    if (dataRes === undefined) {
      console.log("episode not found")
      return
    }
    dataRes.forEach((data) => {
      if (
        data.quality === "1080p" ||
        data.quality === "default" ||
        data.quality === "backup"
      ) {
        episode.upsert({
          episode_url: data.url,
          id,
          quality: data.quality,
          anime_id: animeId,
        })
      }
    })
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = {
  GetbyId,
  SearchFromApi,
  GetByName,
  GetEpisodesByAnimeId,
  GetEpisodeId,
  SearchEpisodeApi,
  SearchEpisodesApi,
}
