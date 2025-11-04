import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import {
  CreateWorkoutPlanRequest,
  CreateWorkoutPlanResponse,
  UpdateWorkoutPlanRequest,
  UpdateWorkoutPlanResponse,
  GetWorkoutPlanResponse,
  GetAllWorkoutPlansResponse,
  DeleteWorkoutPlanResponse
} from '~/types/workoutPlan.type'
import { workoutPlanService } from '~/services/workoutPlan.service'

const createNew = async (
  req: Request<{}, {}, CreateWorkoutPlanRequest, {}>,
  res: Response<CreateWorkoutPlanResponse>,
  next: NextFunction
) => {
  try {
    const result = await workoutPlanService.createNew(req)

    res.status(StatusCodes.CREATED).json({
      message: 'Workout plan created successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const getAll = async (
  req: Request,
  res: Response<GetAllWorkoutPlansResponse>,
  next: NextFunction
) => {
  try {
    const result = await workoutPlanService.getAll(req)

    res.status(StatusCodes.OK).json({
      message: 'Workout plans retrieved successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const getOneById = async (
  req: Request<{ id: string }, {}, {}, {}>,
  res: Response<GetWorkoutPlanResponse>,
  next: NextFunction
) => {
  try {
    const result = await workoutPlanService.getOneById(req)

    res.status(StatusCodes.OK).json({
      message: 'Workout plan retrieved successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const update = async (
  req: Request<{ id: string }, {}, UpdateWorkoutPlanRequest, {}>,
  res: Response<UpdateWorkoutPlanResponse>,
  next: NextFunction
) => {
  try {
    const result = await workoutPlanService.update(req)

    res.status(StatusCodes.OK).json({
      message: 'Workout plan updated successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const deleteOne = async (
  req: Request<{ id: string }, {}, {}, {}>,
  res: Response<DeleteWorkoutPlanResponse>,
  next: NextFunction
) => {
  try {
    await workoutPlanService.deleteOne(req)

    res.status(StatusCodes.OK).json({
      message: 'Workout plan deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

export const workoutPlanController = {
  createNew,
  getAll,
  getOneById,
  update,
  deleteOne
}
