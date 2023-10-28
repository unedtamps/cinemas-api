const { Op } = require("sequelize")
const model = require("../../models")
const tv = model.tv
const tvWatch = model.tvWatch


const GetTvByName = async (name) => {
  try {
    const datas = await tv.findAll({
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
const GetTvByIdDB = async (id) => {
  try {
    let data = await tv.findOne({
      where: {
        id,
      },
    })
    if (data) {
      data = data.dataValues
    }
    return data
  } catch (error) {
    console.log(error.message)
  }
}

const GetEpisodeTvById = async (id) => {
  try {
    const datas = await tvWatch.findAll({
      attributes: { exclude: "tvId" },
      where: {
        tv_id: id,
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


module.exports = {
    GetTvByIdDB,
    GetEpisodeTvById,
    GetTvByName
}
