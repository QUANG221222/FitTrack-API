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

const getLatestByCode = async (req: Request): Promise<any> => {
  try {
    const { metricCode } = req.params
    const userId = req.jwtDecoded.id

    const latestEntry = await metricEntryModel.findLatestByCode(
      userId,
      metricCode
    )

    if (!latestEntry) {
      return {
        message: 'No metric entries found for this code',
        data: null
      }
    }

    return {
      message: 'Latest metric retrieved successfully',
      data: pickMetricEntry(latestEntry)
    }
  } catch (error) {
    throw error
  }
}

const getHistoryByCode = async (req: Request): Promise<any> => {
  try {
    const { metricCode } = req.params
    const { startDate, endDate, limit } = req.query
    const userId = req.jwtDecoded.id

    const filters: any = {}
    if (startDate) filters.startDate = startDate
    if (endDate) filters.endDate = endDate
    if (limit) filters.limit = limit

    const history = await metricEntryModel.findHistoryByCode(
      userId,
      metricCode,
      filters
    )

    return {
      message: 'Metric history retrieved successfully',
      data: history.map((entry) => pickMetricEntry(entry))
    }
  } catch (error) {
    throw error
  }
}

const getStatsByCode = async (req: Request): Promise<any> => {
  try {
    const { metricCode } = req.params
    const { startDate, endDate, groupBy } = req.query
    const userId = req.jwtDecoded.id

    const filters: any = {}
    if (startDate) filters.startDate = startDate
    if (endDate) filters.endDate = endDate

    const entries = await metricEntryModel.getStatsByCode(
      userId,
      metricCode,
      filters
    )

    if (entries.length === 0) {
      return {
        message: 'No data available for statistics',
        data: null
      }
    }

    // Calculate statistics
    const values = entries.map((entry) => entry.value)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length
    const count = entries.length

    // Calculate trend
    const firstValue = entries[0].value
    const lastValue = entries[entries.length - 1].value
    const changePercent = ((lastValue - firstValue) / firstValue) * 100

    let trend: 'up' | 'down' | 'stable' = 'stable'
    if (Math.abs(changePercent) < 1) {
      trend = 'stable'
    } else if (changePercent > 0) {
      trend = 'up'
    } else {
      trend = 'down'
    }

    return {
      message: 'Metric stats retrieved successfully',
      data: {
        metricCode,
        period: {
          startDate: startDate || entries[0].measureAt,
          endDate: endDate || entries[entries.length - 1].measureAt
        },
        min: parseFloat(min.toFixed(2)),
        max: parseFloat(max.toFixed(2)),
        avg: parseFloat(avg.toFixed(2)),
        count,
        trend,
        changePercent: parseFloat(changePercent.toFixed(2))
      }
    }
  } catch (error) {
    throw error
  }
}

export const metricEntryService = {
  createNew,
  getAll,
  getOneById,
  update,
  deleteOne,
  getLatestByCode,
  getHistoryByCode,
  getStatsByCode
}
