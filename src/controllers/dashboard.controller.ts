import { Request, Response, NextFunction } from 'express'
import { dashboardService } from '~/services/dashboard.service'
import { StatusCodes } from 'http-status-codes'

const getTotalExercises = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const total = await dashboardService.getTotalExercises()
    res.status(StatusCodes.OK).json({
      message: 'Total exercises fetched successfully',
      total: total
    })
  } catch (error: any) {
    next(error)
  }
}

const getTotalUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const total = await dashboardService.getTotalUsers()
    res.status(StatusCodes.OK).json({
      message: 'Total users fetched successfully',
      total: total
    })
  } catch (error: any) {
    next(error)
  }
}

const getTotalUsersByMonth = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const totalByMonth = await dashboardService.getTotalUsersByMonth()
    res.status(StatusCodes.OK).json({
      message: 'Total users by month fetched successfully',
      totalByMonth: totalByMonth
    })
  } catch (error) {
    next(error)
  }
}

const getTotalMuscleGroups = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const total = await dashboardService.getTotalMuscleGroups()
    res.status(StatusCodes.OK).json({
      message: 'Total muscle groups fetched successfully',
      total: total
    })
  } catch (error: any) {
    next(error)
  }
}

const getTotalWorkoutPlans = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const total = await dashboardService.getTotalWorkoutPlans()
    res.status(StatusCodes.OK).json({
      message: 'Total workout plans fetched successfully',
      total: total
    })
  } catch (error: any) {
    next(error)
  }
}

const countExercisesByType = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const total = await dashboardService.getTotalExercisesByType()
    res.status(StatusCodes.OK).json({
      message: 'Exercise counts by type fetched successfully',
      total: total
    })
  } catch (error: any) {
    next(error)
  }
}

export const dashboardController = {
  getTotalExercises,
  getTotalUsers,
  getTotalMuscleGroups,
  getTotalWorkoutPlans,
  getTotalUsersByMonth,
  countExercisesByType
}
