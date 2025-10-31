import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import {
  CreateAdminRequest,
  CreateAdminResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  AdminLoginRequest,
  AdminLoginResponse
} from '~/types/admin.type'
import { adminService } from '~/services/admin.service'
import ms from 'ms'
import { env } from '~/configs/environment'

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

const login = async (
  req: Request<{}, {}, AdminLoginRequest, {}>,
  res: Response<AdminLoginResponse>,
  next: NextFunction
) => {
  try {
    const result = await adminService.login(req)

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true, // security: only server can access cookie
      secure: env.BUILD_MODE === 'production', // true: only send cookie over HTTPS
      sameSite: (env.BUILD_MODE === 'production' ? 'none' : 'lax') as
        | 'none'
        | 'lax', // CSRF protection
      maxAge: ms('14 days')
    })

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: env.BUILD_MODE === 'production',
      sameSite: (env.BUILD_MODE === 'production' ? 'none' : 'lax') as
        | 'none'
        | 'lax',
      maxAge: ms('14 days')
    })

    res.status(StatusCodes.OK).json({
      message: 'Login successful',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const adminController = {
  createNew,
  verifyEmail,
  login
}
