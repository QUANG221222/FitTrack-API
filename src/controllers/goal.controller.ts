import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import {
  CreateGoalRequest,
  CreateGoalResponse,
  UpdateGoalRequest,
  UpdateGoalResponse,
  GetGoalResponse,
  GetAllGoalsResponse,
  DeleteGoalResponse
} from '~/types/goal.type'
import { goalService } from '~/services/goal.service'

const createNew = async (
  req: Request<{}, {}, CreateGoalRequest, {}>,
  res: Response<CreateGoalResponse>,
  next: NextFunction
) => {
  try {
    const result = await goalService.createNew(req)

    res.status(StatusCodes.CREATED).json({
      message: 'Goal created successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const getAll = async (
  req: Request,
  res: Response<GetAllGoalsResponse>,
  next: NextFunction
) => {
  try {
    const result = await goalService.getAll(req)

    res.status(StatusCodes.OK).json({
      message: 'Goals retrieved successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const getOneById = async (
  req: Request<{ id: string }, {}, {}, {}>,
  res: Response<GetGoalResponse>,
  next: NextFunction
) => {
  try {
    const result = await goalService.getOneById(req)

    res.status(StatusCodes.OK).json({
      message: 'Goal retrieved successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const update = async (
  req: Request<{ id: string }, {}, UpdateGoalRequest, {}>,
  res: Response<UpdateGoalResponse>,
  next: NextFunction
) => {
  try {
    const result = await goalService.update(req)

    res.status(StatusCodes.OK).json({
      message: 'Goal updated successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const deleteOne = async (
  req: Request<{ id: string }, {}, {}, {}>,
  res: Response<DeleteGoalResponse>,
  next: NextFunction
) => {
  try {
    await goalService.deleteOne(req)

    res.status(StatusCodes.OK).json({
      message: 'Goal deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

export const goalController = {
  createNew,
  getAll,
  getOneById,
  update,
  deleteOne
}
