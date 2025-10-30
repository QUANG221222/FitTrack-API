import { ObjectId } from 'mongodb'

export interface IUser {
  _id?: ObjectId
  email: string
  password: string
  displayName: string
  role: string
  isActive: boolean
  verifyToken?: string
  gender?: string
  dob?: Date
  heightCm?: number
  weightKg?: number
  avatar?: string
  createdAt: Date
  updatedAt: Date | null
}

export interface CreateUserRequest {
  email: string
  password: string
}

export interface CreateUserResponse {
  message: string
  data: Partial<IUser>
}

export interface VerifyEmailRequest {
  email: string
  token: string
}

export interface VerifyEmailResponse {
  message: string
  data: Partial<IUser>
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  message: string
  data: Partial<IUser>
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  message: string
  accessToken: string
}
