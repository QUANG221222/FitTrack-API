import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import {
  CreateProgressPhotoRequest,
  CreateProgressPhotoResponse,
  UpdateProgressPhotoRequest,
  UpdateProgressPhotoResponse,
  GetProgressPhotoResponse,
  GetAllProgressPhotosResponse,
  DeleteProgressPhotoResponse
} from '~/types/progressPhoto.type'
import { progressPhotoService } from '~/services/progressPhoto.service'

const createNew = async (
  req: Request<{}, {}, CreateProgressPhotoRequest, {}>,
  res: Response<CreateProgressPhotoResponse>,
  next: NextFunction
) => {
  try {
    const result = await progressPhotoService.createNew(req)

    res.status(StatusCodes.CREATED).json({
      message: 'Progress photo created successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const getAll = async (
  req: Request,
  res: Response<GetAllProgressPhotosResponse>,
  next: NextFunction
) => {
  try {
    const result = await progressPhotoService.getAll(req)

    res.status(StatusCodes.OK).json({
      message: 'Progress photos retrieved successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const getOneById = async (
  req: Request<{ id: string }, {}, {}, {}>,
  res: Response<GetProgressPhotoResponse>,
  next: NextFunction
) => {
  try {
    const result = await progressPhotoService.getOneById(req)

    res.status(StatusCodes.OK).json({
      message: 'Progress photo retrieved successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const update = async (
  req: Request<{ id: string }, {}, UpdateProgressPhotoRequest, {}>,
  res: Response<UpdateProgressPhotoResponse>,
  next: NextFunction
) => {
  try {
    const result = await progressPhotoService.update(req)

    res.status(StatusCodes.OK).json({
      message: 'Progress photo updated successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const deleteOne = async (
  req: Request<{ id: string }, {}, {}, {}>,
  res: Response<DeleteProgressPhotoResponse>,
  next: NextFunction
) => {
  try {
    await progressPhotoService.deleteOne(req)

    res.status(StatusCodes.OK).json({
      message: 'Progress photo deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

export const progressPhotoController = {
  createNew,
  getAll,
  getOneById,
  update,
  deleteOne
}
