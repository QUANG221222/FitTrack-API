import express from 'express'
import { adminController } from '~/controllers/admin.controller'
import { authHandlingMiddleware } from '~/middlewares/authHandling.middleware'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'
import { adminValidation } from '~/validations/admin.validation'

const Router = express.Router()

Router.post('/register', adminValidation.createNew, adminController.createNew)

Router.post('/verify', adminValidation.verifyEmail, adminController.verifyEmail)

Router.get(
  '/profile',
  authHandlingMiddleware.isAuthorized,
  authHandlingMiddleware.isAdmin,
  adminController.getProfile
)

Router.put(
  '/profile',
  authHandlingMiddleware.isAuthorized,
  authHandlingMiddleware.isAdmin,
  CloudinaryProvider.uploadAdmin.single('avatar'),
  adminValidation.update,
  adminController.update
)

Router.get(
  '/users',
  authHandlingMiddleware.isAuthorized,
  authHandlingMiddleware.isAdmin,
  adminController.getAllUsers
)

Router.delete(
  '/users/:id',
  authHandlingMiddleware.isAuthorized,
  authHandlingMiddleware.isAdmin,
  adminValidation.validateId,
  adminController.deleteUser
)

Router.put(
  '/users/:id',
  authHandlingMiddleware.isAuthorized,
  authHandlingMiddleware.isAdmin,
  CloudinaryProvider.uploadUser.single('avatar'),
  adminValidation.updateUser,
  adminController.updateUser
)

export const adminRoutes: express.Router = Router
