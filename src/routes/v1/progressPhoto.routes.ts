import express from 'express'
import { progressPhotoController } from '~/controllers/progressPhoto.controller'
import { progressPhotoValidation } from '~/validations/progressPhoto.validation'
import { authHandlingMiddleware } from '~/middlewares/authHandling.middleware'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'

const Router = express.Router()

// All routes require authentication (users can only manage their own progress photos)

Router.post(
  '/',
  authHandlingMiddleware.isAuthorized,
  CloudinaryProvider.uploadProgressPhoto.single('image'),
  progressPhotoValidation.createNew,
  progressPhotoController.createNew
)

Router.get(
  '/',
  authHandlingMiddleware.isAuthorized,
  progressPhotoController.getAll
)

Router.get(
  '/:id',
  authHandlingMiddleware.isAuthorized,
  progressPhotoValidation.validateId,
  progressPhotoController.getOneById
)

Router.put(
  '/:id',
  authHandlingMiddleware.isAuthorized,
  CloudinaryProvider.uploadProgressPhoto.single('image'),
  progressPhotoValidation.update,
  progressPhotoController.update
)

Router.delete(
  '/:id',
  authHandlingMiddleware.isAuthorized,
  progressPhotoValidation.validateId,
  progressPhotoController.deleteOne
)

export const progressPhotoRoutes: express.Router = Router
