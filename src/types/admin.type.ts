import { ObjectId } from 'mongodb'

export interface IAdmin {
  _id: ObjectId
  email: string
  password: string
  displayName: string
  phoneNumber: string | null
  bio: string | null
  location: string | null
  dob: Date | null
  gender: string | null
  heightCm: number | null
  weightKg: number | null
  role: string
  isActive: boolean
  verifyToken?: string | null
  avatar?: string | null
  avatarPublicId?: string | null
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

export interface UpdateAdminRequest {
  displayName?: string
  phoneNumber?: string | null
  bio?: string | null
  location?: string | null
  gender?: string | null
  dob?: Date | null
  heightCm?: number | null
  weightKg?: number | null
  avatar?: string
  avatarPublicId?: string
  isActive?: boolean
}

export interface UpdateAdminResponse {
  message: string
  data: Partial<IAdmin>
}

export interface GetAdminResponse {
  message: string
  data: Partial<IAdmin>
}
