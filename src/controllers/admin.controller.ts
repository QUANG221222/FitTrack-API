import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import {
  CreateAdminRequest,
  CreateAdminResponse,
  GetAdminResponse,
  UpdateAdminResponse
} from '~/types/admin.type'
import { adminService } from '~/services/admin.service'

const createNew = async (
  req: Request<{}, {}, CreateAdminRequest, {}>,
  res: Response<CreateAdminResponse>,
  next: NextFunction
) => {
  try {
    const result = await adminService.createNew(req)

    res.status(StatusCodes.CREATED).json({
      message: 'Admin created successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const getProfile = async (
  req: Request,
  res: Response<GetAdminResponse>,
  next: NextFunction
) => {
  try {
    const result = await adminService.getProfile(req)

    res.status(StatusCodes.OK).json({
      message: 'Admin profile retrieved successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const update = async (
  req: Request,
  res: Response<UpdateAdminResponse>,
  next: NextFunction
) => {
  try {
    const result = await adminService.update(req)

    res.status(StatusCodes.OK).json({
      message: 'Admin profile updated successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const getAllUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await adminService.getAllUsers()

    res.status(StatusCodes.OK).json({
      message: 'All users retrieved successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const deleteUser = async (
  req: Request<{ id: string }, {}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    await adminService.deleteUser(req)

    res.status(StatusCodes.OK).json({
      message: 'User deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminService.updateUser(req)

    res.status(StatusCodes.OK).json({
      message: 'User updated successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const toggleUserStatus = async (
  req: Request<{ id: string }, {}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await adminService.toggleUserStatus(req)

    res.status(StatusCodes.OK).json({
      message: 'User status toggled successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const adminController = {
  createNew,
  update,
  updateUser,
  deleteUser,
  getAllUsers,
  getProfile,
  toggleUserStatus
}
