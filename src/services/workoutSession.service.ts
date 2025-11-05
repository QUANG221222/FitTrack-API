import { Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { workoutSessionModel } from '~/models/workoutSession.model'
import { workoutPlanModel } from '~/models/workoutPlan.model'
import { exerciseModel } from '~/models/exercise.model'
import { userModel } from '~/models/user.model'
import ApiError from '~/utils/ApiError'
import { pickWorkoutSession } from '~/utils/fomatter'

const createNew = async (req: Request): Promise<any> => {
  try {
    const { planId, startTime, endTime, mood, energyLevel, note, exercises } =
      req.body

    // Get userId from JWT token
    const userId = req.jwtDecoded.id

    // Check if user exists
    const user = await userModel.findOneById(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    // Validate workout plan exists if provided
    if (planId) {
      const workoutPlan = await workoutPlanModel.findOneById(planId)
      if (!workoutPlan) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Workout plan not found')
      }

      // Check if user owns this workout plan
      if (workoutPlan.userId.toString() !== userId.toString()) {
        throw new ApiError(
          StatusCodes.FORBIDDEN,
          'You are not authorized to use this workout plan'
        )
      }
    }

    // Validate time range
    if (new Date(startTime) >= new Date(endTime)) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Start time must be before end time'
      )
    }

    // Validate exercises if provided
    if (exercises && exercises.length > 0) {
      for (const exercise of exercises) {
        const exerciseExists = await exerciseModel.findOneById(
          exercise.exerciseId
        )
        if (!exerciseExists) {
          throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Exercise with id ${exercise.exerciseId} not found`
          )
        }

        // Validate sets
        if (exercise.sets && exercise.sets.length > 0) {
          for (const set of exercise.sets) {
            if (set.setNo < 1) {
              throw new ApiError(
                StatusCodes.BAD_REQUEST,
                'Set number must be at least 1'
              )
            }
            if (set.reps < 0) {
              throw new ApiError(
                StatusCodes.BAD_REQUEST,
                'Reps cannot be negative'
              )
            }
            if (set.weight < 0) {
              throw new ApiError(
                StatusCodes.BAD_REQUEST,
                'Weight cannot be negative'
              )
            }
            if (set.rpe && (set.rpe < 0 || set.rpe > 10)) {
              throw new ApiError(
                StatusCodes.BAD_REQUEST,
                'RPE must be between 0 and 10'
              )
            }
          }
        }
      }
    }

    // Prepare workout session data
    const workoutSessionData: any = {
      userId,
      planId: planId || null,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      mood: mood || '',
      energyLevel: energyLevel || null,
      note: note || '',
      exercises: exercises || []
    }

    const createdWorkoutSession = await workoutSessionModel.createNew(
      workoutSessionData
    )

    const newWorkoutSession = await workoutSessionModel.findOneById(
      createdWorkoutSession.insertedId.toString()
    )

    return pickWorkoutSession(newWorkoutSession)
  } catch (error) {
    throw error
  }
}

const getAll = async (req: Request): Promise<any> => {
  try {
    const { planId, startDate, endDate, mood, energyLevel } = req.query

    // Get userId from JWT token
    const userId = req.jwtDecoded.id

    const filters: any = { userId }

    if (planId) filters.planId = planId
    if (startDate) filters.startDate = startDate
    if (endDate) filters.endDate = endDate
    if (mood) filters.mood = mood
    if (energyLevel) filters.energyLevel = energyLevel

    const workoutSessions = await workoutSessionModel.findAll(filters)
    return workoutSessions.map((session) => pickWorkoutSession(session))
  } catch (error) {
    throw error
  }
}

const getOneById = async (req: Request): Promise<any> => {
  try {
    const { id } = req.params
    const userId = req.jwtDecoded.id

    const workoutSession = await workoutSessionModel.findOneById(id)

    if (!workoutSession) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Workout session not found')
    }

    // Check if user owns this workout session
    if (workoutSession.userId.toString() !== userId.toString()) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        'You are not authorized to view this workout session'
      )
    }

    return pickWorkoutSession(workoutSession)
  } catch (error) {
    throw error
  }
}

const update = async (req: Request): Promise<any> => {
  try {
    const { id } = req.params
    const userId = req.jwtDecoded.id

    // Find workout session
    const workoutSession = await workoutSessionModel.findOneById(id)
    if (!workoutSession) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Workout session not found')
    }

    // Check if user owns this workout session
    if (workoutSession.userId.toString() !== userId.toString()) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        'You are not authorized to update this workout session'
      )
    }

    // Validate workout plan exists if provided
    if (req.body.planId) {
      const workoutPlan = await workoutPlanModel.findOneById(req.body.planId)
      if (!workoutPlan) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Workout plan not found')
      }

      // Check if user owns this workout plan
      if (workoutPlan.userId.toString() !== userId.toString()) {
        throw new ApiError(
          StatusCodes.FORBIDDEN,
          'You are not authorized to use this workout plan'
        )
      }
    }

    // Validate time range if dates are being updated
    const newStartTime = req.body.startTime || workoutSession.startTime
    const newEndTime = req.body.endTime || workoutSession.endTime

    if (new Date(newStartTime) >= new Date(newEndTime)) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Start time must be before end time'
      )
    }

    // Validate exercises if provided
    if (req.body.exercises && req.body.exercises.length > 0) {
      for (const exercise of req.body.exercises) {
        const exerciseExists = await exerciseModel.findOneById(
          exercise.exerciseId
        )
        if (!exerciseExists) {
          throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Exercise with id ${exercise.exerciseId} not found`
          )
        }

        // Validate sets
        if (exercise.sets && exercise.sets.length > 0) {
          for (const set of exercise.sets) {
            if (set.setNo < 1) {
              throw new ApiError(
                StatusCodes.BAD_REQUEST,
                'Set number must be at least 1'
              )
            }
            if (set.reps < 0) {
              throw new ApiError(
                StatusCodes.BAD_REQUEST,
                'Reps cannot be negative'
              )
            }
            if (set.weight < 0) {
              throw new ApiError(
                StatusCodes.BAD_REQUEST,
                'Weight cannot be negative'
              )
            }
            if (set.rpe && (set.rpe < 0 || set.rpe > 10)) {
              throw new ApiError(
                StatusCodes.BAD_REQUEST,
                'RPE must be between 0 and 10'
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

    // Update workout session in database
    const updatedWorkoutSession = await workoutSessionModel.update(
      id,
      updateData
    )

    if (!updatedWorkoutSession) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to update workout session'
      )
    }

    return pickWorkoutSession(updatedWorkoutSession)
  } catch (error) {
    throw error
  }
}

const deleteOne = async (req: Request): Promise<any> => {
  try {
    const { id } = req.params
    const userId = req.jwtDecoded.id

    // Find workout session to check ownership
    const workoutSession = await workoutSessionModel.findOneById(id)
    if (!workoutSession) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Workout session not found')
    }

    // Check if user owns this workout session
    if (workoutSession.userId.toString() !== userId.toString()) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        'You are not authorized to delete this workout session'
      )
    }

    // Delete workout session from database
    const deleted = await workoutSessionModel.deleteOne(id)

    if (!deleted) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to delete workout session'
      )
    }

    return { deleted: true }
  } catch (error) {
    throw error
  }
}

export const workoutSessionService = {
  createNew,
  getAll,
  getOneById,
  update,
  deleteOne
}
