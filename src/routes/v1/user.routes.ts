import express from 'express'
import { userValidation } from '~/validations/user.validation'
import { userController } from '~/controllers/user.controller'
import { authHandlingMiddleware } from '~/middlewares/authHandling.middleware'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'

const Router = express.Router()

Router.post('/register', userValidation.createNew, userController.createNew)

Router.route('/verify').post(
  userValidation.verifyEmail,
  userController.verifyEmail
)

Router.route('/login').post(userValidation.login, userController.login)

Router.put(
  '/profile',
  authHandlingMiddleware.isAuthorized,
  CloudinaryProvider.uploadUser.single('avatar'),
  userValidation.update,
  userController.update
)

export const userRoutes: express.Router = Router
