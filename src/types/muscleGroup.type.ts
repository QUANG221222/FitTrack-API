import { ObjectId } from 'mongodb'

export interface IMuscleGroup {
  _id?: ObjectId
  name: string
  description?: string
  imageUrl?: string
  imagePublicId?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateMuscleGroupRequest {
  name: string
  description?: string
}

export interface CreateMuscleGroupResponse {
  message: string
  data: Partial<IMuscleGroup>
}

export interface UpdateMuscleGroupRequest {
  name?: string
  description?: string
}

export interface UpdateMuscleGroupResponse {
  message: string
  data: Partial<IMuscleGroup>
}

export interface GetMuscleGroupResponse {
  message: string
  data: Partial<IMuscleGroup>
}

export interface GetAllMuscleGroupsResponse {
  message: string
  data: Partial<IMuscleGroup>[]
}

export interface DeleteMuscleGroupResponse {
  message: string
}
