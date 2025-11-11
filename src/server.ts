import express from 'express'
import { env } from '~/configs/environment'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { corsOptions } from '~/configs/cors'
import { CONNECT_DB } from '~/configs/mongodb'
import { APIs_V1 } from '~/routes/v1/index.routes'
import { errorHandlingMiddleware } from '~/middlewares/errorHandling.middleware'

const START_SERVER = () => {
  const app = express()

  // Fix Cache from disk of Express
  app.use((_req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

  // Config Cookie Parser
  app.use(cookieParser())

  // Config CORS
  app.use(cors(corsOptions))

  // Middleware to parse JSON requests
  app.use(express.json())

  // Route for API v1
  app.use('/v1', APIs_V1)

  // Global Error Handling Middleware
  app.use(errorHandlingMiddleware)

  if (env.BUILD_MODE === 'dev') {
    app.listen(Number(env.LOCAL_APP_PORT), String(env.LOCAL_APP_HOST), () => {
      console.log(
        `LOCAL DEV: Hello ${env.AUTHOR_NAME}, Server is running at http://${env.LOCAL_APP_HOST}:${env.LOCAL_APP_PORT}`
      )
    })
  } else {
    app.listen(Number(process.env.PORT), () => {
      console.log(
        `PRODUCTION: Hello ${env.AUTHOR_NAME}, Backend Server is running successfully at Port: ${process.env.PORT}`
      )
    })
  }
}

// Immediately Invoked Function Expression (IIFE) to start the server
;(async () => {
  try {
    console.log('1. Connecting to MongoDB...')
    await CONNECT_DB()
    console.log('2. Connected to MongoDB successfully!')

    // Start the server
    START_SERVER()
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    process.exit(0) // Exit the process with failure
  }
})()
