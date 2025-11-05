import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import {
  CreateWorkoutSessionRequest,
  CreateWorkoutSessionResponse,
  UpdateWorkoutSessionRequest,
  UpdateWorkoutSessionResponse,
  GetWorkoutSessionResponse,
  GetAllWorkoutSessionsResponse,
  DeleteWorkoutSessionResponse
} from '~/types/workoutSession.type'
import { workoutSessionService } from '~/services/workoutSession.service'

const createNew = async (
  req: Request<{}, {}, CreateWorkoutSessionRequest, {}>,
  res: Response<CreateWorkoutSessionResponse>,
  next: NextFunction
) => {
  try {
    const result = await workoutSessionService.createNew(req)

    res.status(StatusCodes.CREATED).json({
      message: 'Workout session created successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const getAll = async (
  req: Request,
  res: Response<GetAllWorkoutSessionsResponse>,
  next: NextFunction
) => {
  try {
    const result = await workoutSessionService.getAll(req)

    res.status(StatusCodes.OK).json({
      message: 'Workout sessions retrieved successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const getOneById = async (
  req: Request<{ id: string }, {}, {}, {}>,
  res: Response<GetWorkoutSessionResponse>,
  next: NextFunction
) => {
  try {
    const result = await workoutSessionService.getOneById(req)

    res.status(StatusCodes.OK).json({
      message: 'Workout session retrieved successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const update = async (
  req: Request<{ id: string }, {}, UpdateWorkoutSessionRequest, {}>,
  res: Response<UpdateWorkoutSessionResponse>,
  next: NextFunction
) => {
  try {
    const result = await workoutSessionService.update(req)

    res.status(StatusCodes.OK).json({
      message: 'Workout session updated successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const deleteOne = async (
  req: Request<{ id: string }, {}, {}, {}>,
  res: Response<DeleteWorkoutSessionResponse>,
  next: NextFunction
) => {
  try {
    await workoutSessionService.deleteOne(req)

    res.status(StatusCodes.OK).json({
      message: 'Workout session deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

export const workoutSessionController = {
  createNew,
  getAll,
  getOneById,
  update,
  deleteOne
}
