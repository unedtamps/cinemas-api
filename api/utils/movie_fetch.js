const { default: axios } = require("axios")
require("dotenv").config()

const movieUrl = `${process.env.API_URL}/movies/flixhq`

const SearchMovieTV = async (title) => {
  try {
    const data = await axios({
      method: "get",
      url: `${movieUrl}/${title}`,
    })

    if (data === null || data === undefined) {
      throw new Error("Movie Not Found")
    }
    return data.data
  } catch (error) {
    console.log(error.message)
  }
}

const MediaInfo = async (mediaID) => {
  try {
    const data = await axios({
      method: "get",
      url: `${movieUrl}/info?id=${mediaID}`,
    })
    if (data === null || data === undefined) {
      throw new Error("Movie Not Found")
    }
    return data.data
  } catch (error) {
    console.log(error.message)
  }
}

const FetchEpisodeSource = async (id, mediaId) => {
  try {
    const data = await axios({
      method: "get",
      url: `${movieUrl}/watch?episodeId=${id}&mediaId=${mediaId}`,
    })
    if (!data || data === null || data === undefined) {
      throw new Error("Movie Not Found")
    }
    return data.data
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = {
  SearchMovieTV,
  MediaInfo,
  FetchEpisodeSource,
}
