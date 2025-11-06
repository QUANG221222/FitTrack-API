import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import {
  CreateMetricEntryRequest,
  CreateMetricEntryResponse,
  UpdateMetricEntryRequest,
  UpdateMetricEntryResponse,
  GetMetricEntryResponse,
  GetAllMetricEntriesResponse,
  DeleteMetricEntryResponse
} from '~/types/metricEntry.type'
import { metricEntryService } from '~/services/metricEntry.service'

const createNew = async (
  req: Request<{}, {}, CreateMetricEntryRequest, {}>,
  res: Response<CreateMetricEntryResponse>,
  next: NextFunction
) => {
  try {
    const result = await metricEntryService.createNew(req)

    res.status(StatusCodes.CREATED).json({
      message: 'Metric entry created successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const getAll = async (
  req: Request,
  res: Response<GetAllMetricEntriesResponse>,
  next: NextFunction
) => {
  try {
    const result = await metricEntryService.getAll(req)

    res.status(StatusCodes.OK).json({
      message: 'Metric entries retrieved successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const getOneById = async (
  req: Request<{ id: string }, {}, {}, {}>,
  res: Response<GetMetricEntryResponse>,
  next: NextFunction
) => {
  try {
    const result = await metricEntryService.getOneById(req)

    res.status(StatusCodes.OK).json({
      message: 'Metric entry retrieved successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const update = async (
  req: Request<{ id: string }, {}, UpdateMetricEntryRequest, {}>,
  res: Response<UpdateMetricEntryResponse>,
  next: NextFunction
) => {
  try {
    const result = await metricEntryService.update(req)

    res.status(StatusCodes.OK).json({
      message: 'Metric entry updated successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const deleteOne = async (
  req: Request<{ id: string }, {}, {}, {}>,
  res: Response<DeleteMetricEntryResponse>,
  next: NextFunction
) => {
  try {
    await metricEntryService.deleteOne(req)

    res.status(StatusCodes.OK).json({
      message: 'Metric entry deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

export const metricEntryController = {
  createNew,
  getAll,
  getOneById,
  update,
  deleteOne
}
