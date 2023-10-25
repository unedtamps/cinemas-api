const {
  MovieFromApi,
  GetMovieEpsApi,
  GetMovieByName,
  GetEpisodeMovieById,
  GetSubtitleById,
} = require("../usecase/movie.usecase")

const GetMovieName = async (req, res) => {
  try {
    const name = req.params.name
    let datas = await GetMovieByName(name)
    if (datas.length === 0) {
      datas = await MovieFromApi(name)
      if (datas.length === 0) {
        return res.status(404).json({
          message: "Movie Not Found",
          success: false,
        })
      }
    }
    return res.json({
      success: true,
      data: datas,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}
const GetEpisodeSubs = async (req, res) => {
  try {
    const id = req.query.movieid
    const eps = await GetEpisodeMovieById(id)
    const subs = await GetSubtitleById(id.split('-').pop())

    if (eps.length === 0 || subs.length === 0) {
      const fromApi = await GetMovieEpsApi(id)
      if (fromApi.length === 0) {
        return res.status(404).json({
          message: "Episode Not Found",
          success: false,
        })
      }
      return res.json({
        success: true,
        data: fromApi,
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
    res.status(500).json({
      error: "server error",
    })
  }
}
module.exports = { GetMovieName, GetEpisodeSubs }
