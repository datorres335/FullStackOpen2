const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
const mongoose = require('mongoose')
const Author = require('../models/author')
const Book = require('../models/book')

const rebuildAuthorRelationships = async () => {
  try {
    // Debug: Check if MONGODB_URI is loaded
    console.log('MONGODB_URI loaded:', process.env.MONGODB_URI ? 'Yes ✓' : 'No ❌')
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set')
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Rest of your code stays the same...
    // Step 1: Clear all authorOf arrays
    console.log('Step 1: Clearing all authorOf arrays...')
    const clearResult = await Author.updateMany({}, { $set: { authorOf: [] } })
    console.log(`Cleared authorOf arrays for ${clearResult.modifiedCount} authors`)

    // Step 2: Rebuild the relationships
    console.log('Step 2: Rebuilding author-book relationships...')
    const authors = await Author.find({})
    console.log(`Found ${authors.length} authors to process`)

    let processedCount = 0
    for (const author of authors) {
      // Find all books by this author
      const books = await Book.find({ author: author._id })
      
      if (books.length > 0) {
        // Update the authorOf array with book IDs
        author.authorOf = books.map(book => book._id)
        await author.save()
        
        console.log(`✓ Updated ${author.name}: ${books.length} books`)
        processedCount++
      } else {
        console.log(`- ${author.name}: no books found`)
      }
    }

    console.log(`\n✅ Successfully rebuilt relationships for ${processedCount} authors`)
    
    // Verify the results
    const authorsWithBooks = await Author.find({ authorOf: { $exists: true, $not: { $size: 0 } } })
    console.log(`📊 ${authorsWithBooks.length} authors now have books in their authorOf array`)

  } catch (error) {
    console.error('❌ Error rebuilding relationships:', error.message)
  } finally {
    // Close the database connection
    await mongoose.connection.close()
    console.log('Database connection closed')
    process.exit(0)
  }
}

// Run the script
rebuildAuthorRelationships()