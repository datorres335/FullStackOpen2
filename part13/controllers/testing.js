const router = require('express').Router()
const { Blog, User } = require('../models')

router.post('/reset', async (request, response) => {
  await Blog.destroy({ where: {} })
  await User.destroy({ where: {} })

  response.status(204).end() // 204 No Content
})

module.exports = router