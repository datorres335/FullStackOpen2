require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')
const express = require('express')

const app = express()
app.use(express.json())

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: console.log // This will show the SQL queries
})

class Blog extends Model {}
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ Database connection established successfully.')
    
    await Blog.sync()
    console.log('✅ Blog table synchronized successfully.')
    
  } catch (error) {
    console.error('❌ Unable to connect to database:', error)
    process.exit(1)
  }
}

app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.findAll()
    res.json(blogs)
  } catch (error) {
    console.error('Error fetching blogs:', error)
    res.status(500).json({ error: 'Failed to fetch blogs' })
  }
})

app.post('/api/blogs', async (req, res) => {
  try {
    const { author, url, title, likes } = req.body
    
    if (!url || !title) {
      return res.status(400).json({ 
        error: 'Title and URL are required' 
      })
    }
    
    const blog = await Blog.create({
      author,
      url,
      title,
      likes: likes || 0
    })
    
    res.status(201).json(blog)
  } catch (error) {
    console.error('Error creating blog:', error)
    res.status(400).json({ error: error.message })
  }
})

app.delete('/api/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    const blog = await Blog.findByPk(id)
    
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' })
    }
    
    await blog.destroy()
    res.status(204).end()
    
  } catch (error) {
    console.error('Error deleting blog:', error)
    res.status(500).json({ error: 'Failed to delete blog' })
  }
})

const main = async () => {
  try {
    await initializeDatabase()
    
    const blogs = await Blog.findAll()
    console.log('📚 Current blogs in database:')
    blogs.forEach(blog => {
      console.log(`  ${blog.author}: '${blog.title}', ${blog.likes} likes`)
    })
    
    const PORT = process.env.PORT || 3001
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📚 Blogs API: http://localhost:${PORT}/api/blogs`)
    })
    
  } catch (error) {
    console.error('Unable to connect to the database:', error)
    process.exit(1)
  }
}

main()