require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')
const express = require('express')
const app = express()
app.use(express.json())

// create database connection
const sequelize = new Sequelize(process.env.DATABASE_URL)

class Note extends Model {}
Note.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  important: {
    type: DataTypes.BOOLEAN
  },
  date: {
    type: DataTypes.DATE
  }
}, {
  sequelize, // database connection instance
  underscored: true, // column naming convention
  timestamps: false, // disable auto timestamps
  modelName: 'note' // model identifier
})

const initializeDatabase = async () => {
  try {
    // Test connection
    await sequelize.authenticate()
    console.log('✅ Database connection established successfully.')
    
    // Sync Note model
    await Note.sync()
    console.log('✅ Note table synchronized successfully.')
    
  } catch (error) {
    console.error('❌ Unable to connect to database or sync models:', error)
    process.exit(1) // Exit if database setup fails
  }
}

// Initialize database before starting routes
initializeDatabase()

app.get('/api/notes', async (req, res) => {
  const notes = await Note.findAll()
  console.log(notes.map(n => n.toJSON()));
  
  res.json(notes)
})

app.get('/api/notes/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id)
  if (note) {
    console.log(note.toJSON());
    res.json(note)
  } else {
    res.status(404).end()
  }
})

app.post('/api/notes', async (req, res) => {
  try {
    const note = await Note.create(req.body)
    res.json(note)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})