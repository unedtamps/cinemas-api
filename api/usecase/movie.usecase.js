const { Op } = require("sequelize")
const model = require("../../models")
const movie = model.movie
const mwatch = model.movieWatch

const GetMovieByName = async (name) => {
  try {
    const datas = await movie.findAll({
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
    console.log(error.message)
  }
}
const GetMovieById = async (id) => {
  try {
    let data = await movie.findOne({
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
    throw new Error(error)
  }
}

const GetEpisodeMovieById = async (id) => {
  try {
    const datas = await mwatch.findAll({
      attributes: { exclude: "movieId" },
      where: {
        movie_id: id,
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
const GetEpisodeById = async (id) => {
  try {
    const res = []
    const datas = await mwatch.findAll({
      attributes:{exclude: ["movieId"]},
      where: {
        id,
      },
    })
    datas.forEach(data => {
      res.push(data.dataValues)
    })
    return res
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = {
  GetMovieByName,
  GetMovieById,
  GetEpisodeMovieById,
  GetEpisodeById
}
