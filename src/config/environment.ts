import 'dotenv/config'

export const env = {
  LOCAL_APP_PORT: process.env.LOCAL_APP_PORT || 8080,
  LOCAL_APP_HOST: process.env.LOCAL_APP_HOST || 'localhost',
  BUILD_MODE: process.env.BUILD_MODE,
  AUTHOR_NAME: process.env.AUTHOR_NAME,
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME
}
