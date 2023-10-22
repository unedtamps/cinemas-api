const { Op } = require("sequelize")
const model = require("../../models")
const anime = model.anime
const episode = model.animeEpisode

const GetbyId = async (id) => {
  try {
    let data = await anime.findOne({
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
const GetByName = async (name) => {
  try {
    const datas = await anime.findAll({
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
    console.error(error)
    throw new Error(error)
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
    console.error(error)
    throw new Error(error)
  }
}

const SearchFromApi = async (title) => {
  let url = `https://api.consumet.org/anime/gogoanime/${title}`
  const results = []
  try {
    const datas = await fetch(url)
    const jsonDatas = await datas.json()
    await Promise.all(
      jsonDatas.results.map(async (js) => {
        url = `https://api.consumet.org/anime/gogoanime/info/${js.id}`
        const getInfo = await fetch(url)
        const getJson = await getInfo.json()
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
        anime.create(result)
        results.push(result)
      }),
    )
    return results
  } catch (error) {
    throw new Error(error)
  }
}
const SearchEpisodesApi = async (animeId) => {
  const url = `https://api.consumet.org/anime/gogoanime/info/${animeId}`
  try {
    const results = []
    const info = await fetch(url)
    const infoJson = await info.json()
    const episodes = infoJson.episodes
    await Promise.all(episodes.map(async (ep)=>{
      const urlEps = await SearchEpisodeApi(ep.id, animeId)
      urlEps.forEach(u => {
          results.push(u)
      })
    }))
    return results
  } catch (error) {
    throw new Error(error)
  }
}

const SearchEpisodeApi = async (id, animeId) => {
  const url = `https://api.consumet.org/anime/gogoanime/watch/${id}`
  try {
    const datas = await fetch(url)
    const dataJson = await datas.json()
    const dataRes = dataJson.sources
    const results = []
    dataRes.forEach((data) => {
      if (
        data.quality === "1080p" ||
        data.quality === "default" ||
        data.quality === "backup"
      ) {
        const res = {
          id,
          quality: data.quality,
          anime_id:animeId,
          episode_url: data.url,
        }
        episode.create({
          episode_url:data.url,
          id,
          quality:data.quality,
          anime_id:animeId,
        })
        results.push(res)
      }
    })
    return results
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}

module.exports = {
  GetbyId,
  SearchFromApi,
  GetByName,
  GetEpisodesByAnimeId,
  GetEpisodeId,
  SearchEpisodeApi,
  SearchEpisodesApi
}
