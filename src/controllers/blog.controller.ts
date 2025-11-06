import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import {
  CreateBlogRequest,
  CreateBlogResponse,
  UpdateBlogRequest,
  UpdateBlogResponse,
  GetBlogResponse,
  GetAllBlogsResponse,
  DeleteBlogResponse
} from '~/types/blog.type'
import { blogService } from '~/services/blog.service'

const createNew = async (
  req: Request<{}, {}, CreateBlogRequest, {}>,
  res: Response<CreateBlogResponse>,
  next: NextFunction
) => {
  try {
    const result = await blogService.createNew(req)

    res.status(StatusCodes.CREATED).json({
      message: 'Blog created successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const getAll = async (
  _req: Request,
  res: Response<GetAllBlogsResponse>,
  next: NextFunction
) => {
  try {
    const result = await blogService.getAll()

    res.status(StatusCodes.OK).json({
      message: 'Blogs retrieved successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const getOneById = async (
  req: Request<{ id: string }, {}, {}, {}>,
  res: Response<GetBlogResponse>,
  next: NextFunction
) => {
  try {
    const result = await blogService.getOneById(req.params.id)

    res.status(StatusCodes.OK).json({
      message: 'Blog retrieved successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const update = async (
  req: Request<{ id: string }, {}, UpdateBlogRequest, {}>,
  res: Response<UpdateBlogResponse>,
  next: NextFunction
) => {
  try {
    const result = await blogService.update(req)

    res.status(StatusCodes.OK).json({
      message: 'Blog updated successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const deleteOne = async (
  req: Request<{ id: string }, {}, {}, {}>,
  res: Response<DeleteBlogResponse>,
  next: NextFunction
) => {
  try {
    await blogService.deleteOne(req.params.id)

    res.status(StatusCodes.OK).json({
      message: 'Blog deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

export const blogController = {
  createNew,
  getAll,
  getOneById,
  update,
  deleteOne
}
