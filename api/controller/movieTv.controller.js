const {
  GetMovieTVEpsApi,
  SearchMovieTVAPI,
  FindMovieByName,
  FindEpisodeMovieById,
  FindTvByName,
  FindTvById,
  FindEpisodeByMovieId,
  FindSubtitleById,
  FindMovieById,
  FindEpisodesByTVId,
} = require("../usecase/movieTV.usecase")
// const { GetEpisodeTvById, GetTvByIdDB } = require("../usecase/tv.usecase")

// Movie and TV Series
const GetEpisodeSubs = async (req, res) => {
  try {
    const id = req.query.id
    const type = id.split("/")[0]
    let eps = []
    const subs = await FindSubtitleById(id.split("-").pop())
    if (type === "tv") {
      eps = await FindEpisodesByTVId(id)
    } else {
      eps = await FindEpisodeByMovieId(id)
    }

    if (eps.length === 0 || subs.length === 0) {
      GetMovieTVEpsApi(id, type)
      return res.json({
        success: false,
        messege: "Episode not found, Try again letter",
      })
    }
    return res.json({
      success: true,
      data: {
        episodes: eps,
        subtitles: subs,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      messege: error.message,
    })
  }
}

const GetMovieTvId = async (req, res) => {
  let id = req.query.id
  const type = id.split("/")[0]
  try {
    let data = null
    if (type === "movie") {
      data = await FindMovieById(id)
    } else {
      data = await FindTvById(id)
    }
    id = id.split("/")[1]
    if (!data) {
      SearchMovieTVAPI(id)
      return res.json({
        success: false,
        message: "Movie or Tv Not Found, Try Again Letter",
      })
    }
    return res.json({
      success: true,
      data,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      messege: error.message,
    })
  }
}

// movie only
const GetMovieName = async (req, res) => {
  try {
    const name = req.params.name
    const datas = await FindMovieByName(name)
    if (datas.length === 0) {
      SearchMovieTVAPI(name)
      return res.json({
        success: false,
        message: "Movie Not Found, Try Again Letter",
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

const GetMovieEpisodeById = async (req, res) => {
  const id = req.params.id
  try {
    const episode = await FindEpisodeMovieById(id)
    const subs = await FindSubtitleById(id)
    if (episode.length === 0) {
      return res.status(404).json({
        success: false,
        messege: "Episode NotFound, Try Again Letter",
      })
    }
    return res.json({
      success:true,
      data:{
        episode,
        subtitles:subs
      }
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      messege: error.message,
    })
  }
}
const GetTvName = async (req, res) => {
  try {
    const name = req.params.name
    const datas = await FindTvByName(name)
    if (datas.length === 0) {
      SearchMovieTVAPI(name)
      return res.json({
        success: false,
        message: "TV Not Found, Try Again Letter",
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
const GetTvById = async (req, res) => {
  const id = req.query.id
  try {
    const data = await FindTvById(id)
    if (data.length === 0) {
      SearchMovieTVAPI(id)
      return res.json({
        success: false,
        message: "Tv Series Not Found, Try Again Letter",
      })
    }
    return res.json({
      success: true,
      data,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      messege: error.message,
    })
  }
}

module.exports = {
  GetEpisodeSubs,
  GetMovieTvId,
  GetMovieEpisodeById,
  GetMovieName,
  GetTvName,
  GetTvById,
}
