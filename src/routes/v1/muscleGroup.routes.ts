import express from 'express'
import { muscleGroupController } from '~/controllers/muscleGroup.controller'
import { muscleGroupValidation } from '~/validations/muscleGroup.validation'
import { authHandlingMiddleware } from '~/middlewares/authHandling.middleware'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'

const Router = express.Router()

// Public routes - Get all muscle groups and get one by id
Router.get('/', muscleGroupController.getAll)

Router.get(
  '/:id',
  muscleGroupValidation.validateId,
  muscleGroupController.getOneById
)

// Protected routes - Require authentication (admin only)
Router.post(
  '/',
  authHandlingMiddleware.isAuthorized,
  authHandlingMiddleware.isAdmin,
  CloudinaryProvider.uploadMuscleGroup.single('image'),
  muscleGroupValidation.createNew,
  muscleGroupController.createNew
)

Router.put(
  '/:id',
  authHandlingMiddleware.isAuthorized,
  CloudinaryProvider.uploadMuscleGroup.single('image'),
  muscleGroupValidation.update,
  muscleGroupController.update
)

Router.delete(
  '/:id',
  authHandlingMiddleware.isAuthorized,
  muscleGroupValidation.validateId,
  muscleGroupController.deleteOne
)

export const muscleGroupRoutes: express.Router = Router
