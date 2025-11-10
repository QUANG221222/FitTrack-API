import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/configs/environment'
import { adminModel } from '~/models/admin.model'
import { userModel } from '~/models/user.model'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcryptjs'
import { pickUser } from '~/utils/fomatter'

const refreshToken = async (clientRefreshToken: string): Promise<any> => {
  try {
    // Verify token received from client
    const refreshTokenDecoded = JwtProvider.verifyToken(
      clientRefreshToken,
      env.REFRESH_TOKEN_SECRET_SIGNATURE as string
    )

    // console.log('refreshTokenDecoded', refreshTokenDecoded)

    // We only store unique, immutable user info in the refresh token (e.g. _id, email),
    // so we can reuse the decoded payload directly instead of querying the database.
    const userInfo = {
      id: (refreshTokenDecoded as any).id as string,
      email: (refreshTokenDecoded as any).email as string,
      role: (refreshTokenDecoded as any).role as string
    }

    // Create new accessToken
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE as string,
      // 5 // 5 seconds for testing access token refresh
      env.ACCESS_TOKEN_LIFE as string
    )
    return { accessToken }
  } catch (error) {
    throw error
  }
}

const login = async (req: any) => {
  try {
    const { email, password } = req.body

    let existingUser: any = null

    const adminAccount = await adminModel.findOneByEmail(email)
    const userAccount = await userModel.findOneByEmail(email)

    if (!adminAccount && !userAccount) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    } else if (adminAccount) {
      existingUser = adminAccount
    } else if (userAccount) {
      existingUser = userAccount
    }

    if (!existingUser.isActive) {
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        'Your account is not active! Please verify your email!'
      )
    }

    if (!bcrypt.compareSync(password, existingUser.password)) {
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        'Your Email of Password is incorrect!'
      )
    }

    const userInfo = {
      id: existingUser._id,
      email: existingUser.email,
      role: existingUser.role
    }

    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE as string,
      env.ACCESS_TOKEN_LIFE as string
    )

    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_SECRET_SIGNATURE as string,
      env.REFRESH_TOKEN_LIFE as string
    )

    return {
      accessToken,
      refreshToken,
      ...pickUser(existingUser)
    }
  } catch (error) {
    throw error
  }
}

const verifyEmail = async (req: any) => {
  try {
    const { email, token } = req.body

    let existingUser: any = null

    const adminAccount = await adminModel.findOneByEmail(email)
    const userAccount = await userModel.findOneByEmail(email)

    if (!adminAccount && !userAccount) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    } else if (adminAccount) {
      existingUser = adminAccount
    } else if (userAccount) {
      existingUser = userAccount
    }

    if (existingUser.isActive) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'User already verified')
    }
    if (existingUser.verifyToken !== token) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Invalid verification token')
    }

    const updateUser = {
      isActive: true,
      verifyToken: ''
    }
    if (!existingUser._id) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'User ID is missing'
      )
    }

    // Update user status to active
    if (existingUser.role === 'admin') {
      await adminModel.update(existingUser._id.toString(), updateUser)
    } else {
      await userModel.update(existingUser._id.toString(), updateUser)
    }

    return pickUser(existingUser)
  } catch (error) {
    throw error
  }
}

export const authService = {
  refreshToken,
  login,
  verifyEmail
}
