import express from 'express'
import { adminController } from '~/controllers/admin.controller'
import { adminValidation } from '~/validations/admin.validation'

const Router = express.Router()

Router.post('/register', adminValidation.createNew, adminController.createNew)

Router.post('/verify', adminValidation.verifyEmail, adminController.verifyEmail)

Router.post('/login', adminValidation.login, adminController.login)

export const adminRoutes: express.Router = Router
