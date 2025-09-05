const { Sequelize } = require('sequelize')
const config = require('../utils/config')

const sequelize = new Sequelize(config.DATABASE_URL, {
  dialect: 'postgres',
  logging: false // Set to console.log to see SQL queries
})

const Blog = require('./blog')(sequelize, Sequelize.DataTypes)
const User = require('./user')(sequelize, Sequelize.DataTypes)

// Define associations
User.hasMany(Blog, { 
  foreignKey: 'userId',
  as: 'blogs'
})
Blog.belongsTo(User, { 
  foreignKey: 'userId',
  as: 'user'
})

module.exports = {
  sequelize,
  Blog,
  User
}
