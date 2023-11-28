module.exports = (page, perPage) => {
  page = page !== undefined ? parseInt(page) : 1
  const limit = perPage !== undefined ? perPage : 5
  const offset = (page - 1) * limit
  return { limit: parseInt(limit), offset: parseInt(offset) }
}
