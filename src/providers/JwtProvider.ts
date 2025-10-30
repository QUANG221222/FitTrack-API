import JWT from 'jsonwebtoken'

// Generate JWT Token
const generateToken = async (
  userInfo: any,
  secretSignature: JWT.Secret,
  tokenLife: string | number
): Promise<string> => {
  try {
    const options: JWT.SignOptions = {
      algorithm: 'HS256', // Default algorithm
      expiresIn: tokenLife as JWT.SignOptions['expiresIn']
    }
    return JWT.sign(userInfo, secretSignature, options)
  } catch (error) {
    throw new Error('Error generating token')
  }
}

// Verify JWT Token
const verifyToken = (token: string, secretSignature: JWT.Secret) => {
  try {
    return JWT.verify(token, secretSignature)
  } catch (error: any) {
    throw new Error(`Error verifying token: ${error.message}`)
  }
}

export const JwtProvider = {
  generateToken,
  verifyToken
}
