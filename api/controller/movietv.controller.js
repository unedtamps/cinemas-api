const {
  GetEpisodeMovieById,
  GetMovieById,
} = require("../usecase/movie.usecase")
const {
  GetMovieTVEpsApi,
  SearchMovieTVAPI,
  GetSubtitleById,
} = require("../usecase/movietv.usecase")
const { GetEpisodeTvById, GetTvByIdDB } = require("../usecase/tv.usecase")

const GetEpisodeSubs = async (req, res) => {
  try {
    const id = req.query.id
    const type = id.split("/")[0]
    let eps = []
    const subs = await GetSubtitleById(id.split("-").pop())
    if (type === "tv") {
      eps = await GetEpisodeTvById(id)
    } else {
      eps = await GetEpisodeMovieById(id)
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
      data = await GetMovieById(id)
    } else {
      data = await GetTvByIdDB(id)
    }
    id = id.split("/")[1]
    if (!data) {
      SearchMovieTVAPI(id)
      return res.json({
        success: false,
        message: "Movie/Tv Not Found, Try Again Letter",
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

module.exports = { GetEpisodeSubs, GetMovieTvId }
