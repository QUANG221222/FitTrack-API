import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/configs/environment'

const refreshToken = async (clientRefreshToken: string) => {
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

export const authService = {
  refreshToken
}
