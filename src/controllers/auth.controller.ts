import { NextFunction, Request, Response } from 'express'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import {
  RefreshTokenRequest,
  RefreshTokenResponse,
  LoginRequest,
  LoginResponse,
  VerifyEmailRequest,
  VerifyEmailResponse
} from '~/types/auth.type'
import { authService } from '~/services/auth.service'
import { cookieOptions } from '~/configs/cookieOption'

const verifyEmail = async (
  req: Request<{}, {}, VerifyEmailRequest, {}>,
  res: Response<VerifyEmailResponse>,
  next: NextFunction
) => {
  try {
    const result = await authService.verifyEmail(req)

    res.status(StatusCodes.OK).json({
      message: 'Email verified successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const login = async (
  req: Request<{}, {}, LoginRequest, {}>,
  res: Response<LoginResponse>,
  next: NextFunction
) => {
  try {
    const result = await authService.login(req)

    res.cookie('userRole', result.role, cookieOptions)

    res.cookie('accessToken', result.accessToken, cookieOptions)

    res.cookie('refreshToken', result.refreshToken, cookieOptions)

    res.status(StatusCodes.OK).json({
      message: 'Login successful',
      data: result
    })
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
    const result = await authService.refreshToken(req.cookies?.refreshToken)

    res.cookie('accessToken', result.accessToken, cookieOptions)

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

const logout = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    // Clear cookies - accessToken & refreshToken
    res.clearCookie('accessToken', cookieOptions)
    res.clearCookie('refreshToken', cookieOptions)
    res.clearCookie('userRole', cookieOptions)

    res.status(StatusCodes.OK).json({ message: 'Logout successful' })
  } catch (error: any) {
    next(error)
  }
}

export const authController = {
  refreshToken,
  logout,
  login,
  verifyEmail
}
