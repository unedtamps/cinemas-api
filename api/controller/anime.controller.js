const {
  GetbyId,
  GetEpisodesByAnimeId,
  GetByName,
  GetEpisodeId,
  SearchFromApi,
  SearchEpisodeApi,
  SearchEpisodesApi,
} = require("../usecase/anime.usecase")

const GetAnimeById = async (req, res) => {
  const id = req.query.id
  try {
    const data = await GetbyId(id)
    if (!data) {
      SearchFromApi(id)
      return res.status(404).json({
        success: false,
        messege: "Anime NotFound, Try Again Letter",
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
const GetByTitle = async (req, res) => {
  const title = req.params.title
  try {
    const datas = await GetByName(title)
    if (datas.length === 0) {
      SearchFromApi(title)
      return res.status(404).json({
        success: false,
        messege: "Anime NotFound, Try Again Letter",
      })
    }
    return res.json({
      success: true,
      data: datas,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      messege: error.message,
    })
  }
}
const GetEpsByAnimeId = async (req, res) => {
  const id = req.query.anime_id
  try {
    // check if anime is in table in not in table put it to table first
    const checkAnime = await GetbyId(id)
    if (!checkAnime) {
      SearchFromApi(id)
      return res.status(404).json({
        success: false,
        messege: "Anime NotFound Try Again Letter",
      })
    }
    // now anime are in table or anime are not found
    const datas = await GetEpisodesByAnimeId(id)
    if (datas.length === 0) {
      SearchEpisodesApi(id)
      return res.status(404).json({
        success: false,
        messege: "Episode NotFound, Try Again Letter",
      })
    }
    return res.json(datas)
  } catch (error) {
    return res.status(500).json({
      success: false,
      messege: error.message,
    })
  }
}
const GetAnimeEpisodeById = async (req, res) => {
  const id = req.params.id
  try {
    let animeId = id.split("-")
    animeId.pop()
    animeId.pop()
    animeId = animeId.join('-')
    const anime = await GetbyId(animeId)
    if (!anime){
      SearchFromApi(animeId)
      return res.status(404).json({
        success: false,
        messege: "Anime NotFound Try Again Letter",
      })
    }
    const datas = await GetEpisodeId(id)
    if (datas.length === 0) {
      SearchEpisodeApi(id, animeId)
      return res.status(404).json({
        success: false,
        messege: "Episode NotFound, Try Again Letter",
      })
    }
    return res.json(datas)
  } catch (error) {
    return res.status(500).json({
      success: false,
      messege: error.message,
    })
  }
}

module.exports = {
  GetAnimeById,
  GetByTitle,
  GetEpsByAnimeId,
  GetAnimeEpisodeById,
}
