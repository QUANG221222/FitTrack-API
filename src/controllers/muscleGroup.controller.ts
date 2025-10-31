import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import {
  CreateMuscleGroupRequest,
  CreateMuscleGroupResponse,
  UpdateMuscleGroupRequest,
  UpdateMuscleGroupResponse,
  GetMuscleGroupResponse,
  GetAllMuscleGroupsResponse,
  DeleteMuscleGroupResponse
} from '~/types/muscleGroup.type'
import { muscleGroupService } from '~/services/muscleGroup.service'

const createNew = async (
  req: Request<{}, {}, CreateMuscleGroupRequest, {}>,
  res: Response<CreateMuscleGroupResponse>,
  next: NextFunction
) => {
  try {
    const result = await muscleGroupService.createNew(req)

    res.status(StatusCodes.CREATED).json({
      message: 'Muscle group created successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const getAll = async (
  _req: Request,
  res: Response<GetAllMuscleGroupsResponse>,
  next: NextFunction
) => {
  try {
    const result = await muscleGroupService.getAll()

    res.status(StatusCodes.OK).json({
      message: 'Muscle groups retrieved successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const getOneById = async (
  req: Request<{ id: string }, {}, {}, {}>,
  res: Response<GetMuscleGroupResponse>,
  next: NextFunction
) => {
  try {
    const result = await muscleGroupService.getOneById(req.params.id)

    res.status(StatusCodes.OK).json({
      message: 'Muscle group retrieved successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const update = async (
  req: Request<{ id: string }, {}, UpdateMuscleGroupRequest, {}>,
  res: Response<UpdateMuscleGroupResponse>,
  next: NextFunction
) => {
  try {
    const result = await muscleGroupService.update(req)

    res.status(StatusCodes.OK).json({
      message: 'Muscle group updated successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const deleteOne = async (
  req: Request<{ id: string }, {}, {}, {}>,
  res: Response<DeleteMuscleGroupResponse>,
  next: NextFunction
) => {
  try {
    await muscleGroupService.deleteOne(req.params.id)

    res.status(StatusCodes.OK).json({
      message: 'Muscle group deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

export const muscleGroupController = {
  createNew,
  getAll,
  getOneById,
  update,
  deleteOne
}
