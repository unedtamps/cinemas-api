const {SearchMovieTVAPI}= require("../usecase/movietv.usecase")
const { GetTvByIdDB, GetTvByName } = require("../usecase/tv.usecase")

const GetTvName = async (req, res) => {
  try {
    const name = req.params.name
    const datas = await GetTvByName(name)
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
    const data = await GetTvByIdDB(id)
    if (data.length === 0){
      SearchMovieTVAPI(id)
      return res.json({
        success: false,
        message: "Tv Series Not Found, Try Again Letter",
      })
    }
    return res.json({
      success: true,
      data
    })
  }catch(error){
    return res.status(500).json({
      success: false,
      messege: error.message,
    })
  }
}

module.exports = { GetTvName, GetTvById}
