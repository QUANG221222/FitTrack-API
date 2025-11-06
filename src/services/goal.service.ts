import { Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { goalModel } from '~/models/goal.model'
import { userModel } from '~/models/user.model'
import { exerciseModel } from '~/models/exercise.model'
import ApiError from '~/utils/ApiError'
import { pickGoal } from '~/utils/fomatter'

const createNew = async (req: Request): Promise<any> => {
  try {
    const {
      goalType,
      targetValue,
      unit,
      startValue,
      startDate,
      targetDate,
      note,
      metricCode,
      exerciseId
    } = req.body

    // Get userId from JWT token
    const userId = req.jwtDecoded.id

    // Check if user exists
    const user = await userModel.findOneById(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    // Validate exercise exists if exerciseId is provided
    if (exerciseId) {
      const exercise = await exerciseModel.findOneById(exerciseId)
      if (!exercise) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          `Exercise with id ${exerciseId} not found`
        )
      }
    }

    // Validate date range
    if (
      startDate &&
      targetDate &&
      new Date(startDate) >= new Date(targetDate)
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Start date must be before target date'
      )
    }

    // Validate startValue and targetValue relationship
    if (startValue !== undefined && startValue === targetValue) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Start value and target value cannot be the same'
      )
    }

    // Prepare goal data
    const goalData: any = {
      userId,
      goalType,
      targetValue,
      unit: unit || '',
      startValue: startValue || null,
      startDate: startDate ? new Date(startDate) : null,
      targetDate: targetDate ? new Date(targetDate) : null,
      status: 'active',
      note: note || '',
      metricCode: metricCode || '',
      exerciseId: exerciseId || null
    }

    const createdGoal = await goalModel.createNew(goalData)

    const newGoal = await goalModel.findOneById(
      createdGoal.insertedId.toString()
    )

    return pickGoal(newGoal)
  } catch (error) {
    throw error
  }
}

const getAll = async (req: Request): Promise<any> => {
  try {
    const { goalType, status, exerciseId, startDate, endDate } = req.query

    // Get userId from JWT token
    const userId = req.jwtDecoded.id

    const filters: any = { userId }

    if (goalType) filters.goalType = goalType
    if (status) filters.status = status
    if (exerciseId) filters.exerciseId = exerciseId
    if (startDate) filters.startDate = startDate
    if (endDate) filters.endDate = endDate

    const goals = await goalModel.findAll(filters)
    return goals.map((goal) => pickGoal(goal))
  } catch (error) {
    throw error
  }
}

const getOneById = async (req: Request): Promise<any> => {
  try {
    const { id } = req.params
    const userId = req.jwtDecoded.id

    const goal = await goalModel.findOneById(id)

    if (!goal) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Goal not found')
    }

    // Check if user owns this goal
    if (goal.userId.toString() !== userId.toString()) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        'You are not authorized to view this goal'
      )
    }

    return pickGoal(goal)
  } catch (error) {
    throw error
  }
}

const update = async (req: Request): Promise<any> => {
  try {
    const { id } = req.params
    const userId = req.jwtDecoded.id

    // Find goal
    const goal = await goalModel.findOneById(id)
    if (!goal) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Goal not found')
    }

    // Check if user owns this goal
    if (goal.userId.toString() !== userId.toString()) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        'You are not authorized to update this goal'
      )
    }

    // Validate exercise exists if exerciseId is provided
    if (req.body.exerciseId) {
      const exercise = await exerciseModel.findOneById(req.body.exerciseId)
      if (!exercise) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          `Exercise with id ${req.body.exerciseId} not found`
        )
      }
    }

    // Validate date range if dates are being updated
    const newStartDate = req.body.startDate || goal.startDate
    const newTargetDate = req.body.targetDate || goal.targetDate

    if (
      newStartDate &&
      newTargetDate &&
      new Date(newStartDate) >= new Date(newTargetDate)
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Start date must be before target date'
      )
    }

    // Validate startValue and targetValue relationship if both are present
    const newStartValue =
      req.body.startValue !== undefined ? req.body.startValue : goal.startValue
    const newTargetValue =
      req.body.targetValue !== undefined
        ? req.body.targetValue
        : goal.targetValue

    if (
      newStartValue !== undefined &&
      newStartValue !== null &&
      newStartValue === newTargetValue
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Start value and target value cannot be the same'
      )
    }

    // Prepare update data
    const updateData = {
      ...req.body,
      updatedAt: Date.now()
    }

    // Convert dates to Date objects if provided
    if (updateData.startDate) {
      updateData.startDate = new Date(updateData.startDate)
    }
    if (updateData.targetDate) {
      updateData.targetDate = new Date(updateData.targetDate)
    }

    // Update goal in database
    const updatedGoal = await goalModel.update(id, updateData)

    if (!updatedGoal) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to update goal'
      )
    }

    return pickGoal(updatedGoal)
  } catch (error) {
    throw error
  }
}

const deleteOne = async (req: Request): Promise<any> => {
  try {
    const { id } = req.params
    const userId = req.jwtDecoded.id

    // Find goal to check ownership
    const goal = await goalModel.findOneById(id)
    if (!goal) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Goal not found')
    }

    // Check if user owns this goal
    if (goal.userId.toString() !== userId.toString()) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        'You are not authorized to delete this goal'
      )
    }

    // Delete goal from database
    const deleted = await goalModel.deleteOne(id)

    if (!deleted) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to delete goal'
      )
    }

    return { deleted: true }
  } catch (error) {
    throw error
  }
}

export const goalService = {
  createNew,
  getAll,
  getOneById,
  update,
  deleteOne
}
