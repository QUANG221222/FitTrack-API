import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import {
  CreateAdminRequest,
  CreateAdminResponse,
  VerifyEmailRequest,
  VerifyEmailResponse
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

const verifyEmail = async (
  req: Request<{}, {}, VerifyEmailRequest, {}>,
  res: Response<VerifyEmailResponse>,
  next: NextFunction
) => {
  try {
    const result = await adminService.verifyEmail(req)

    res.status(StatusCodes.OK).json({
      message: 'Email verified successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const adminController = {
  createNew,
  verifyEmail
}
