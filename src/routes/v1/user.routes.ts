import express from 'express'
import { userValidation } from '~/validations/user.validation'
import { userController } from '~/controllers/user.controller'

const Router = express.Router()

Router.post('/register', userValidation.createNew, userController.createNew)

Router.route('/verify').post(
  userValidation.verifyEmail,
  userController.verifyEmail
)

export const userRoutes: express.Router = Router
