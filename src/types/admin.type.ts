import { ObjectId } from 'mongodb'

export interface IAdmin {
  _id: ObjectId
  email: string
  password: string
  displayName: string
  role: string
  isActive: boolean
  verifyToken?: string | null
  avatar?: string | null
  createdAt?: Date
  updatedAt?: Date
}

export interface CreateAdminRequest {
  secretKey: string
  email: string
  password: string
}

export interface CreateAdminResponse {
  message: string
  data: Partial<IAdmin>
}

export interface VerifyEmailRequest {
  email: string
  token: string
}

export interface VerifyEmailResponse {
  message: string
  data: Partial<IAdmin>
}

export interface AdminLoginRequest {
  email: string
  password: string
}

export interface AdminLoginResponse {
  message: string
  data: {
    admin: Partial<IAdmin>
    accessToken: string
    refreshToken: string
  }
}
