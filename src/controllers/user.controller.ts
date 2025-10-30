import { Request, Response, NextFunction } from 'express'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import {
  CreateUserRequest,
  CreateUserResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  RefreshTokenRequest
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
      secure: env.BUILD_MODE === 'production', // // true: only send cookie over HTTPS
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

const logout = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    // Clear cookies - accessToken & refreshToken
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    res.status(StatusCodes.OK).json({ message: 'Logout successful' })
  } catch (error: any) {
    next(error)
  }
}

const refreshToken = async (
  req: Request<{}, {}, RefreshTokenRequest, {}>,
  res: Response<RefreshTokenResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await userService.refreshToken(req.cookies?.refreshToken)

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: env.BUILD_MODE === 'production',
      sameSite: (env.BUILD_MODE === 'production' ? 'none' : 'lax') as
        | 'none'
        | 'lax',
      maxAge: ms('14 days')
    })

    res.status(StatusCodes.OK).json({
      message: 'Token refreshed successfully',
      accessToken: result.accessToken
    })
  } catch (error: any) {
    next(
      new ApiError(
        StatusCodes.FORBIDDEN,
        'Please Sign In! (Error from refresh Token)'
      )
    )
  }
}

export const userController = {
  createNew,
  verifyEmail,
  login,
  logout,
  refreshToken
}
