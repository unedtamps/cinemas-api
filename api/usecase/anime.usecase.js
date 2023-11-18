const { Op } = require("sequelize")
const model = require("../../models")
const { toTitleCase } = require("./utility.usecase")
const { ANIME } = require("@consumet/extensions")
const anime = model.anime
const episode = model.animeEpisode
require("dotenv").config()
const gogoanime = new ANIME.Gogoanime()

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
    const { results } = await gogoanime.search(title)
    await Promise.all(
      results.map(async (js) => {
        const getJson = await gogoanime.fetchAnimeInfo(js.id)
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
    const { episodes } = await gogoanime.fetchAnimeInfo(animeId)
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
    let sources
    const server = await gogoanime.fetchEpisodeServers(id)
    for (const s of server) {
      try {
        const res = await gogoanime.fetchEpisodeSources(id, s.name)
        sources = res.sources
        if (sources) break
      } catch (error) {}
    }
    if (sources == null) {
      console.log("episode not found")
      return
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
  GetbyId,
  SearchFromApi,
  GetByName,
  GetEpisodesByAnimeId,
  GetEpisodeId,
  SearchEpisodeApi,
  SearchEpisodesApi,
}
