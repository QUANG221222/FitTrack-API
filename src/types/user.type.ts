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
