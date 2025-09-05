// PostgreSQL connection test file
// Run with: node postgres_test.js

const { Sequelize } = require('sequelize')
const config = require('./utils/config')

console.log('Testing PostgreSQL connection...')

const sequelize = new Sequelize(config.DATABASE_URL, {
  dialect: 'postgres',
  logging: console.log // Show SQL queries
})

const testConnection = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ PostgreSQL connection established successfully!')
    
    // Test creating a simple blog entry
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS test_blogs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        url VARCHAR(255) NOT NULL,
        likes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✅ Test table created successfully!')
    
    // Insert test data
    const [results] = await sequelize.query(`
      INSERT INTO test_blogs (title, author, url, likes) 
      VALUES ('Test Blog Title', 'Test Author', 'https://test.com', 5)
      RETURNING *
    `)
    console.log('✅ Test data inserted:', results[0])
    
    // Clean up test table
    await sequelize.query('DROP TABLE test_blogs')
    console.log('✅ Test table cleaned up!')
    
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message)
  } finally {
    await sequelize.close()
    console.log('🔒 Connection closed')
  }
}

testConnection()
