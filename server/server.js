import 'dotenv/config'
import { validateEnv } from './src/config/env.js'
import { connectDB } from './src/config/db.js'
import app from './src/app.js'

validateEnv()

const PORT = process.env.PORT || 5000

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message)
    process.exit(1)
  })
