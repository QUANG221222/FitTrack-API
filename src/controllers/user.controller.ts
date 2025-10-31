import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import {
  CreateUserRequest,
  CreateUserResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  LoginRequest,
  LoginResponse,
  UpdateUserResponse
} from '~/types/user.type'
import { userService } from '~/services/user.service'
import ms from 'ms'
import { env } from '~/configs/environment'

const createNew = async (
  req: Request<{}, {}, CreateUserRequest, {}>,
  res: Response<CreateUserResponse>,
  next: NextFunction
) => {
  try {
    const createUser = await userService.createNew(req)

    res.status(StatusCodes.CREATED).send({
      message: 'User created successfully',
      data: createUser
    })
  } catch (error: any) {
    next(error)
  }
}

const verifyEmail = async (
  req: Request<{}, {}, VerifyEmailRequest, {}>,
  res: Response<VerifyEmailResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await userService.verifyEmail(req)

    res.status(StatusCodes.OK).json({
      message: 'Email verified successfully',
      data: result
    })
  } catch (error: any) {
    next(error)
  }
}

const login = async (
  req: Request<{}, {}, LoginRequest, {}>,
  res: Response<LoginResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await userService.login(req)

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
  } catch (error: any) {
    next(error)
  }
}

const update = async (
  req: Request,
  res: Response<UpdateUserResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.file) {
      req.body.avatar = req.file.path
      req.body.avatarPublicId = req.file.filename
    }

    const result = await userService.update(req)

    res.status(StatusCodes.OK).json({
      message: 'User updated successfully',
      data: result
    })
  } catch (error: any) {
    next(error)
  }
}

export const userController = {
  createNew,
  verifyEmail,
  login,
  update
}
