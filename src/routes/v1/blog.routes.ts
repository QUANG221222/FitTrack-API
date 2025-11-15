import express from 'express'
import { blogController } from '~/controllers/blog.controller'
import { blogValidation } from '~/validations/blog.validation'
import { authHandlingMiddleware } from '~/middlewares/authHandling.middleware'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'

const Router = express.Router()

// Public routes - Get all blogs and get one by id
Router.get('/', blogController.getAll)

Router.get('/:id', blogValidation.validateId, blogController.getOneById)

// Protected routes - Require authentication (admin only)
Router.post(
  '/',
  authHandlingMiddleware.isAuthorized,
  authHandlingMiddleware.isAdmin,
  CloudinaryProvider.uploadBlogThumbnail.single('image'),
  blogValidation.createNew,
  blogController.createNew
)

Router.put(
  '/:id',
  authHandlingMiddleware.isAuthorized,
  authHandlingMiddleware.isAdmin,
  CloudinaryProvider.uploadBlogThumbnail.single('image'),
  blogValidation.update,
  blogController.update
)

Router.delete(
  '/:id',
  authHandlingMiddleware.isAuthorized,
  authHandlingMiddleware.isAdmin,
  blogValidation.validateId,
  blogController.deleteOne
)

Router.put('/:id/like', blogValidation.validateId, blogController.likeBlog)

Router.put('/:id/view', blogValidation.validateId, blogController.viewBlog)

export const blogRoutes: express.Router = Router
