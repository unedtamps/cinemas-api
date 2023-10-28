const {
  GetMovieByName,
  GetEpisodeById,
} = require("../usecase/movie.usecase")
const { SearchMovieTVAPI } = require("../usecase/movietv.usecase")

const GetMovieName = async (req, res) => {
  try {
    const name = req.params.name
    const datas = await GetMovieByName(name)
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
    const episode = await GetEpisodeById(id)
    if (episode.length === 0) {
      return res.status(404).json({
        success: false,
        messege: "Episode NotFound, Try Again Letter",
      })
    }
    return res.json(episode)
  } catch (error) {
    return res.status(500).json({
      success: false,
      messege: error.message,
    })
  }
}

module.exports = { GetMovieName, GetMovieByName, GetMovieEpisodeById }
