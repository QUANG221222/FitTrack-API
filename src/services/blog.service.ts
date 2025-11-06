import { Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { blogModel } from '~/models/blog.model'
import ApiError from '~/utils/ApiError'
import { pickBlog } from '~/utils/fomatter'

const createNew = async (req: Request): Promise<any> => {
  try {
    const { name, description, content } = req.body

    // Check if blog already exists
    const existingBlog = await blogModel.findOneByName(name)
    if (existingBlog) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        'Blog with this name already exists'
      )
    }

    // Prepare blog data
    const blogData: any = {
      name,
      description: description || '',
      content: content || ''
    }

    const createdBlog = await blogModel.createNew(blogData)

    const newBlog = await blogModel.findOneById(
      createdBlog.insertedId.toString()
    )

    return pickBlog(newBlog)
  } catch (error) {
    throw error
  }
}

const getAll = async (): Promise<any> => {
  try {
    const blogs = await blogModel.findAll()
    return blogs.map((blog) => pickBlog(blog))
  } catch (error) {
    throw error
  }
}

const getOneById = async (id: string): Promise<any> => {
  try {
    const blog = await blogModel.findOneById(id)

    if (!blog) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Blog not found')
    }

    return pickBlog(blog)
  } catch (error) {
    throw error
  }
}

const update = async (req: Request): Promise<any> => {
  try {
    const { id } = req.params

    // Find blog
    const blog = await blogModel.findOneById(id)
    if (!blog) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Blog not found')
    }

    // Check if name is being updated and if it conflicts with existing
    if (req.body.name && req.body.name !== blog.name) {
      const existingBlog = await blogModel.findOneByName(req.body.name)
      if (existingBlog) {
        throw new ApiError(
          StatusCodes.CONFLICT,
          'Blog with this name already exists'
        )
      }
    }

    // Prepare update data
    const updateData = {
      ...req.body,
      updatedAt: Date.now()
    }

    // Update blog in database
    const updatedBlog = await blogModel.update(id, updateData)

    if (!updatedBlog) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to update blog'
      )
    }

    return pickBlog(updatedBlog)
  } catch (error) {
    throw error
  }
}

const deleteOne = async (id: string): Promise<any> => {
  try {
    // Find blog to check if it exists
    const blog = await blogModel.findOneById(id)
    if (!blog) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Blog not found')
    }

    // Delete blog from database
    const deleted = await blogModel.deleteOne(id)

    if (!deleted) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to delete blog'
      )
    }

    return { deleted: true }
  } catch (error) {
    throw error
  }
}

export const blogService = {
  createNew,
  getAll,
  getOneById,
  update,
  deleteOne
}
