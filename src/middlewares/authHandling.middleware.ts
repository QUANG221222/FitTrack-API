import { NextFunction, Request, Response } from 'express'
import ApiError from '~/utils/ApiError'
import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/configs/environment'
import { StatusCodes } from 'http-status-codes'

declare global {
  namespace Express {
    interface Request {
      jwtDecoded?: any
    }
  }
}

const isAuthorized = (req: Request, _res: Response, next: NextFunction) => {
  // Get tokens from client cookies
  const clientAccessToken = req.cookies?.accessToken as string
  const clientRefreshToken = req.cookies?.refreshToken as string

  // Verify access token
  if (!clientAccessToken) {
    next(
      new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized!! (Token not found)')
    )
    return
  }

  try {
    // Decode accessToken
    const accessTokenDecoded = JwtProvider.verifyToken(
      clientAccessToken,
      env.ACCESS_TOKEN_SECRET_SIGNATURE as string
    )

    // Attach decoded info to req object
    req.jwtDecoded = accessTokenDecoded

    // Proceed to next middleware/controller
    next()
  } catch (error: any) {
    // console.log('authMiddleware error: ', error)

    // If accessToken is expired
    if (error?.message?.includes('jwt expired')) {
      // Check if refreshToken is provided
      if (!clientRefreshToken) {
        next(
          new ApiError(
            StatusCodes.UNAUTHORIZED,
            'Unauthorized!! (Refresh token not found)'
          )
        )
        return
      }

      // Verify refreshToken
      try {
        JwtProvider.verifyToken(
          clientRefreshToken,
          env.REFRESH_TOKEN_SECRET_SIGNATURE as string
        )
        next(
          new ApiError(
            StatusCodes.GONE,
            'Access token expired. Need to refresh token.'
          )
        )
      } catch (refreshError: any) {
        // console.log('Refresh token error: ', refreshError)
        next(
          new ApiError(
            StatusCodes.UNAUTHORIZED,
            'Unauthorized!! (Refresh token expired or invalid)'
          )
        )
      }
      return
    }

    // If accessToken is invalid, return 401 (Unauthorized)
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized request'))
  }
}

const isAdmin = (req: Request, _res: Response, next: NextFunction) => {
  try {
    if (req.jwtDecoded?.role !== 'admin') {
      next(new ApiError(StatusCodes.FORBIDDEN, 'Forbidden request'))
      return
    }
    next()
  } catch (error: any) {
    next(
      new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error')
    )
  }
}

export const authHandlingMiddleware = {
  isAuthorized,
  isAdmin
}
