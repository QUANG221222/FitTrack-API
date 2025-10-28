import 'dotenv/config'

export const env = {
  LOCAL_APP_PORT: process.env.PORT || 3000,
  LOCAL_APP_HOST: process.env.HOST || 'localhost',
  BUILD_MODE: process.env.BUILD_MODE,
  AUTHOR_NAME: process.env.AUTHOR_NAME
}
