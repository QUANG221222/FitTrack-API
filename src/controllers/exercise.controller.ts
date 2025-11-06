import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import {
  CreateExerciseRequest,
  CreateExerciseResponse,
  UpdateExerciseRequest,
  UpdateExerciseResponse,
  GetExerciseResponse,
  GetAllExercisesResponse,
  DeleteExerciseResponse,
  UploadExerciseVideoResponse
} from '~/types/exercise.type'
import { exerciseService } from '~/services/exercise.service'

const createNew = async (
  req: Request<{}, {}, CreateExerciseRequest, {}>,
  res: Response<CreateExerciseResponse>,
  next: NextFunction
) => {
  try {
    const result = await exerciseService.createNew(req)

    res.status(StatusCodes.CREATED).json({
      message: 'Exercise created successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const getAll = async (
  req: Request,
  res: Response<GetAllExercisesResponse>,
  next: NextFunction
) => {
  try {
    const result = await exerciseService.getAll(req)

    res.status(StatusCodes.OK).json({
      message: 'Exercises retrieved successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const getOneById = async (
  req: Request<{ id: string }, {}, {}, {}>,
  res: Response<GetExerciseResponse>,
  next: NextFunction
) => {
  try {
    const result = await exerciseService.getOneById(req.params.id)

    res.status(StatusCodes.OK).json({
      message: 'Exercise retrieved successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const update = async (
  req: Request<{ id: string }, {}, UpdateExerciseRequest, {}>,
  res: Response<UpdateExerciseResponse>,
  next: NextFunction
) => {
  try {
    const result = await exerciseService.update(req)

    res.status(StatusCodes.OK).json({
      message: 'Exercise updated successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const deleteOne = async (
  req: Request<{ id: string }, {}, {}, {}>,
  res: Response<DeleteExerciseResponse>,
  next: NextFunction
) => {
  try {
    await exerciseService.deleteOne(req)

    res.status(StatusCodes.OK).json({
      message: 'Exercise deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

const uploadVideo = async (
  req: Request<{ id: string }, {}, {}, {}>,
  res: Response<UploadExerciseVideoResponse>,
  next: NextFunction
) => {
  try {
    const result = await exerciseService.uploadVideo(req)

    res.status(StatusCodes.OK).json({
      message: 'Video uploaded successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const exerciseController = {
  createNew,
  getAll,
  getOneById,
  update,
  deleteOne,
  uploadVideo
}
