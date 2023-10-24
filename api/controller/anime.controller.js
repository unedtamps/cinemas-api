const {
  GetbyId,
  GetEpisodesByAnimeId,
  GetByName,
  GetEpisodeId,
  SearchFromApi,
  SearchEpisodeApi,
  SearchEpisodesApi,
} = require("../usecase/anime.usecase")

const GetAnime = async (req, res) => {
  const id = req.params.id
  try {
    const data = await GetbyId(id)
    if (!data) {
      return res.status(404).json({
        success: false,
        messege: "Anime NotFound",
      })
    }
    return res.json(data)
  } catch (error) {
    return res.status(500).json({
      success: false,
      messege: "Server Internal Error " + error,
    })
  }
}
const GetTitle = async (req, res) => {
  const title = req.params.title
  try {
    let datas = await GetByName(title)
    if (datas.length === 0) {
      const apidata = await SearchFromApi(title)
      if (apidata.length === 0) {
        return res.status(404).json({
          success: false,
          messege: "Anime NotFound",
        })
      }
      datas = apidata
    }
    return res.json(datas)
  } catch (error) {
    return res.status(500).json({
      success: false,
      messege: "Server Internal Error",
    })
  }
}
const GetEpisodes = async (req, res) => {
  const id = req.params.anime_id
  try {
    // check if anime is in table in not in table put it to table first
    const checkAnime = await GetbyId(id)
    if (!checkAnime) {
      const fromApi = await SearchFromApi(id)
      if (fromApi.length === 0) {
        return res.status(404).json({
          success: false,
          messege: "Episode NotFound",
        })
      }
    }
    // now anime are in table or anime are not found
    let datas = await GetEpisodesByAnimeId(id)
    if (datas.length === 0) {
      const episodesApi = await SearchEpisodesApi(id)
      if (episodesApi.length === 0) {
        return res.status(404).json({
          success: false,
          messege: "Episode NotFound",
        })
      }
      datas = episodesApi
    }
    return res.json(datas)
  } catch (error) {
    return res.status(500).json({
      success: false,
      messege: "Server Internal Error " + error,
    })
  }
}
const GetEpisode = async (req, res) => {
  const id = req.body.id
  try {
    let datas = await GetEpisodeId(id)
    if (datas.length === 0) {
      const episodeApi = await SearchEpisodeApi(id)
      if (episodeApi.length === 0) {
        return res.status(404).json({
          success: false,
          messege: "Anime NotFound",
        })
      }
      datas = episodeApi
    }
    return res.json(datas)
  } catch (error) {
    return res.status(500).json({
      success: false,
      messege: "Server Internal Error " + error  ,
    })
  }
}

module.exports = { GetAnime, GetTitle, GetEpisodes, GetEpisode }
