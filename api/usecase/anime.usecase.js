const { Op } = require("sequelize")
const model = require("../../models")
const { toTitleCase } = require("./utility.usecase")
const anime = model.anime
const episode = model.animeEpisode
require("dotenv").config()
const axios = require("axios")
const { BaseError } = require("../handler/error.handler")
const FindAnimeById = async (id) => {
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
    throw new BaseError(error.message)
  }
}
const FindAnimeByTitle = async (name, limit, offset) => {
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
          {
            other_name: {
              [Op.like]: `%${name}%`,
            },
          },
        ],
      },
      limit,
      offset,
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

const FindEpisodesByAnimeId = async (animeId) => {
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
const FindAnimeEpisodeById = async (id) => {
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
    const { data } = await axios({
      method: "get",
      url: `${process.env.API_URL}/anime/gogoanime/${title}`,
    })
    const results = data.results
    await Promise.all(
      results.map(async (js) => {
        const data = await axios({
          method: "get",
          url: `${process.env.API_URL}/anime/gogoanime/info/${js.id}`,
        })
        const getJson = data.data
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
          other_name: getJson.otherName,
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
    const { data } = await axios({
      method: "get",
      url: `${process.env.API_URL}/anime/gogoanime/info/${animeId}`,
    })
    const episodes = data.episodes
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
    console.log(id)
    const { data } = await axios({
      method: "get",
      url: `${process.env.API_URL}/anime/gogoanime/watch/${id}`,
    })
    const sources = data.sources
    if (sources === null) {
      throw new BaseError("Episode Not Found")
    }
    sources.forEach((data) => {
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
  FindAnimeById,
  SearchFromApi,
  FindAnimeByTitle,
  FindEpisodesByAnimeId,
  FindAnimeEpisodeById,
  SearchEpisodeApi,
  SearchEpisodesApi,
}
