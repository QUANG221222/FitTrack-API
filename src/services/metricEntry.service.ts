import { Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { metricEntryModel } from '~/models/metricEntry.model'
import { userModel } from '~/models/user.model'
import ApiError from '~/utils/ApiError'
import { pickMetricEntry } from '~/utils/fomatter'

const createNew = async (req: Request): Promise<any> => {
  try {
    const { metricCode, value, unit, note, measureAt } = req.body

    // Get userId from JWT token
    const userId = req.jwtDecoded.id

    // Check if user exists
    const user = await userModel.findOneById(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    // Prepare metric entry data
    const metricEntryData: any = {
      userId,
      metricCode,
      value,
      unit,
      note: note || '',
      measureAt: measureAt ? new Date(measureAt) : new Date()
    }

    const createdMetricEntry = await metricEntryModel.createNew(metricEntryData)

    const newMetricEntry = await metricEntryModel.findOneById(
      createdMetricEntry.insertedId.toString()
    )

    return pickMetricEntry(newMetricEntry)
  } catch (error) {
    throw error
  }
}

const getAll = async (req: Request): Promise<any> => {
  try {
    const { metricCode, startDate, endDate } = req.query

    // Get userId from JWT token
    const userId = req.jwtDecoded.id

    const filters: any = { userId }

    if (metricCode) filters.metricCode = metricCode
    if (startDate) filters.startDate = startDate
    if (endDate) filters.endDate = endDate

    const metricEntries = await metricEntryModel.findAll(filters)
    return metricEntries.map((entry) => pickMetricEntry(entry))
  } catch (error) {
    throw error
  }
}

const getOneById = async (req: Request): Promise<any> => {
  try {
    const { id } = req.params
    const userId = req.jwtDecoded.id

    const metricEntry = await metricEntryModel.findOneById(id)

    if (!metricEntry) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Metric entry not found')
    }

    // Check if user owns this metric entry
    if (metricEntry.userId.toString() !== userId.toString()) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        'You are not authorized to view this metric entry'
      )
    }

    return pickMetricEntry(metricEntry)
  } catch (error) {
    throw error
  }
}

const update = async (req: Request): Promise<any> => {
  try {
    const { id } = req.params
    const userId = req.jwtDecoded.id

    // Find metric entry
    const metricEntry = await metricEntryModel.findOneById(id)
    if (!metricEntry) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Metric entry not found')
    }

    // Check if user owns this metric entry
    if (metricEntry.userId.toString() !== userId.toString()) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        'You are not authorized to update this metric entry'
      )
    }

    // Prepare update data
    const updateData = {
      ...req.body,
      updatedAt: Date.now()
    }

    // Convert measureAt to Date if provided
    if (updateData.measureAt) {
      updateData.measureAt = new Date(updateData.measureAt)
    }

    // Update metric entry in database
    const updatedMetricEntry = await metricEntryModel.update(id, updateData)

    if (!updatedMetricEntry) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to update metric entry'
      )
    }

    return pickMetricEntry(updatedMetricEntry)
  } catch (error) {
    throw error
  }
}

const deleteOne = async (req: Request): Promise<any> => {
  try {
    const { id } = req.params
    const userId = req.jwtDecoded.id

    // Find metric entry to check ownership
    const metricEntry = await metricEntryModel.findOneById(id)
    if (!metricEntry) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Metric entry not found')
    }

    // Check if user owns this metric entry
    if (metricEntry.userId.toString() !== userId.toString()) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        'You are not authorized to delete this metric entry'
      )
    }

    // Delete metric entry from database
    const deleted = await metricEntryModel.deleteOne(id)

    if (!deleted) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to delete metric entry'
      )
    }

    return { deleted: true }
  } catch (error) {
    throw error
  }
}

export const metricEntryService = {
  createNew,
  getAll,
  getOneById,
  update,
  deleteOne
}
