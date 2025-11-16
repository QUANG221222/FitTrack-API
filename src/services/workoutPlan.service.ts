import { Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { workoutPlanModel } from '~/models/workoutPlan.model'
import { exerciseModel } from '~/models/exercise.model'
import { userModel } from '~/models/user.model'
import ApiError from '~/utils/ApiError'
import { pickWorkoutPlan } from '~/utils/fomatter'

const createNew = async (req: Request): Promise<any> => {
  try {
    const { name, goalHint, startDate, endDate, isActive, days } = req.body

    // Get userId from JWT token
    const userId = req.jwtDecoded.id

    // Check if user exists
    const user = await userModel.findOneById(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    // Validate workout plan exists
    const exitingPlans = await workoutPlanModel.findOneByName(name)
    if (exitingPlans) {
      throw new ApiError(StatusCodes.CONFLICT, 'Workout plan already exists')
    }

    // Validate date range
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Start date must be before end date'
      )
    }

    // Validate exercises in days if provided
    if (days && days.length > 0) {
      for (const day of days) {
        // Validate each exercise item
        if (day.items && day.items.length > 0) {
          for (const item of day.items) {
            const exercise = await exerciseModel.findOneById(item.exerciseId)
            if (!exercise) {
              throw new ApiError(
                StatusCodes.NOT_FOUND,
                `Exercise with id ${item.exerciseId} not found`
              )
            }

            // Validate reps range
            if (item.repsMin > item.repsMax) {
              throw new ApiError(
                StatusCodes.BAD_REQUEST,
                'Minimum reps cannot be greater than maximum reps'
              )
            }
          }
        }
      }
    }

    // If new plan is active, deactivate all other plans for this user
    const shouldBeActive = isActive !== undefined ? isActive : true
    if (shouldBeActive) {
      await workoutPlanModel.deactivateAllForUser(userId)
    }

    // Prepare workout plan data
    const workoutPlanData: any = {
      userId,
      name,
      goalHint: goalHint || '',
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      isActive: shouldBeActive,
      days: days || []
    }

    const createdWorkoutPlan = await workoutPlanModel.createNew(workoutPlanData)

    const newWorkoutPlan = await workoutPlanModel.findOneById(
      createdWorkoutPlan.insertedId.toString()
    )

    return pickWorkoutPlan(newWorkoutPlan)
  } catch (error) {
    throw error
  }
}

const getAll = async (req: Request): Promise<any> => {
  try {
    const { isActive, startDate, endDate } = req.query

    // Get userId from JWT token
    const userId = req.jwtDecoded.id

    const filters: any = { userId }

    if (isActive !== undefined) filters.isActive = isActive === 'true'
    if (startDate) filters.startDate = startDate
    if (endDate) filters.endDate = endDate

    const workoutPlans = await workoutPlanModel.findAll(filters)
    return workoutPlans.map((plan) => pickWorkoutPlan(plan))
  } catch (error) {
    throw error
  }
}

const getOneById = async (req: Request): Promise<any> => {
  try {
    const { id } = req.params
    const userId = req.jwtDecoded.id

    const workoutPlan = await workoutPlanModel.findOneById(id)

    if (!workoutPlan) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Workout plan not found')
    }

    // Check if user owns this workout plan
    if (workoutPlan.userId.toString() !== userId.toString()) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        'You are not authorized to view this workout plan'
      )
    }

    return pickWorkoutPlan(workoutPlan)
  } catch (error) {
    throw error
  }
}

const update = async (req: Request): Promise<any> => {
  try {
    const { id } = req.params
    const userId = req.jwtDecoded.id

    // Find workout plan
    const workoutPlan = await workoutPlanModel.findOneById(id)
    if (!workoutPlan) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Workout plan not found')
    }

    // Check if user owns this workout plan
    if (workoutPlan.userId.toString() !== userId.toString()) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        'You are not authorized to update this workout plan'
      )
    }

    // Validate date range if dates are being updated
    const newStartDate = req.body.startDate || workoutPlan.startDate
    const newEndDate = req.body.endDate || workoutPlan.endDate

    if (
      newStartDate &&
      newEndDate &&
      new Date(newStartDate) > new Date(newEndDate)
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Start date must be before end date'
      )
    }

    // Validate exercises in days if provided
    if (req.body.days && req.body.days.length > 0) {
      for (const day of req.body.days) {
        if (day.items && day.items.length > 0) {
          for (const item of day.items) {
            const exercise = await exerciseModel.findOneById(item.exerciseId)
            if (!exercise) {
              throw new ApiError(
                StatusCodes.NOT_FOUND,
                `Exercise with id ${item.exerciseId} not found`
              )
            }

            // Validate reps range
            if (item.repsMin > item.repsMax) {
              throw new ApiError(
                StatusCodes.BAD_REQUEST,
                'Minimum reps cannot be greater than maximum reps'
              )
            }
          }
        }
      }
    }

    // Prepare update data
    const updateData = {
      ...req.body,
      updatedAt: Date.now()
    }

    // If updating to active, deactivate all other plans for this user FIRST
    if (req.body.isActive === true) {
      await workoutPlanModel.deactivateAllForUser(userId, id)
      // Ensure this plan is set to active
      updateData.isActive = true
    }

    // Update workout plan in database
    const updatedWorkoutPlan = await workoutPlanModel.update(id, updateData)

    if (!updatedWorkoutPlan) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to update workout plan'
      )
    }

    return pickWorkoutPlan(updatedWorkoutPlan)
  } catch (error) {
    throw error
  }
}

const deleteOne = async (req: Request): Promise<any> => {
  try {
    const { id } = req.params
    const userId = req.jwtDecoded.id

    // Find workout plan to check ownership
    const workoutPlan = await workoutPlanModel.findOneById(id)
    if (!workoutPlan) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Workout plan not found')
    }

    // Check if user owns this workout plan
    if (workoutPlan.userId.toString() !== userId.toString()) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        'You are not authorized to delete this workout plan'
      )
    }

    // Delete workout plan from database
    const deleted = await workoutPlanModel.deleteOne(id)

    if (!deleted) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to delete workout plan'
      )
    }

    return { deleted: true }
  } catch (error) {
    throw error
  }
}

export const workoutPlanService = {
  createNew,
  getAll,
  getOneById,
  update,
  deleteOne
}
