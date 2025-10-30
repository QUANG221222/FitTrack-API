import express from 'express'
import { userValidation } from '~/validations/user.validation'
import { userController } from '~/controllers/user.controller'
import { authHandlingMiddleware } from '~/middlewares/authHandling.middleware'

const Router = express.Router()

Router.post('/register', userValidation.createNew, userController.createNew)

Router.route('/verify').post(
  userValidation.verifyEmail,
  userController.verifyEmail
)

Router.route('/login').post(userValidation.login, userController.login)

Router.route('/logout').post(userController.logout)

Router.route('/refresh-token').post(userController.refreshToken)

// Example of a protected route
Router.get('/profile', authHandlingMiddleware.isAuthorized, (req, res) => {
  // Access user info from req.jwtDecoded
  const userInfo = req.jwtDecoded
  res
    .status(200)
    .json({ message: 'User profile fetched successfully', userInfo })
})

Router.get('/debug', (req, res) => {
  try {
    // Get access token & refresh token from request headers or cookies for debugging
    const accessToken = req.cookies['accessToken']
    const refreshToken = req.cookies['refreshToken']
    res
      .status(200)
      .json({ message: 'Debug route is working', accessToken, refreshToken })
  } catch (error: any) {
    if (error?.message?.includes('jwt expired')) {
      console.log('fdafadsfsdfsd')
    }
  }
})
export const userRoutes: express.Router = Router
