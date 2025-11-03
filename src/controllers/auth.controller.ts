import { NextFunction, Request, Response } from 'express'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { RefreshTokenRequest, RefreshTokenResponse } from '~/types/auth.type'
import { authService } from '~/services/auth.service'
import { env } from '~/configs/environment'
import ms from 'ms'

const refreshToken = async (
  req: Request<{}, {}, RefreshTokenRequest, {}>,
  res: Response<RefreshTokenResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await authService.refreshToken(req.cookies?.refreshToken)

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

export const authController = {
  refreshToken,
  logout
}
