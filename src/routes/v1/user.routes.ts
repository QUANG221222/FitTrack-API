import express from 'express'
import { userValidation } from '~/validations/user.validation'
import { userController } from '~/controllers/user.controller'

const Router = express.Router()

Router.post('/register', userValidation.createNew, userController.createNew)

export const userRoutes: express.Router = Router
