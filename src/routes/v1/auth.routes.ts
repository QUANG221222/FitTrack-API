import express from 'express'
import { authController } from '~/controllers/auth.controller'
import { authHandlingMiddleware } from '~/middlewares/authHandling.middleware'
import { authValidation } from '~/validations/auth.validation'

const Router = express.Router()

Router.post('/verify', authValidation.verifyEmail, authController.verifyEmail)

Router.post('/login', authValidation.login, authController.login)

Router.post('/logout', authController.logout)

Router.post('/refresh-token', authController.refreshToken)

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

export const authRoutes: express.Router = Router
