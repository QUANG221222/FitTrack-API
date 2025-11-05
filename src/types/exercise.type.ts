import { ObjectId } from 'mongodb'

export interface IExercise {
  _id?: ObjectId
  adminId: ObjectId
  name: string
  description?: string
  type: 'strength' | 'cardio' | 'mobility' | 'flexibility' | 'calisthenics'
  difficulty: 'beginner' | 'intermediate' | 'advance'
  equipment?: string
  mediaVideoUrl?: string
  mediaImageUrl?: string
  mediaImagePublicId?: string
  primaryMuscles: ObjectId[]
  secondaryMuscles: ObjectId[]
  isPublic: boolean
  createdAt: Date
  updatedAt: Date | null
}

export interface CreateExerciseRequest {
  name: string
  description?: string
  type: 'strength' | 'cardio' | 'mobility' | 'flexibility'
  difficulty?: 'beginner' | 'intermediate' | 'advance'
  equipment?: string
  mediaVideoUrl?: string
  primaryMuscles: string[]
  secondaryMuscles?: string[]
  isPublic?: boolean
}

export interface CreateExerciseResponse {
  message: string
  data: Partial<IExercise>
}

export interface UpdateExerciseRequest {
  name?: string
  description?: string
  type?: 'strength' | 'cardio' | 'mobility' | 'flexibility'
  difficulty?: 'beginner' | 'intermediate' | 'advance'
  equipment?: string
  mediaVideoUrl?: string
  primaryMuscles?: string[]
  secondaryMuscles?: string[]
  isPublic?: boolean
}

export interface UpdateExerciseResponse {
  message: string
  data: Partial<IExercise>
}

export interface GetExerciseResponse {
  message: string
  data: Partial<IExercise>
}

export interface GetAllExercisesResponse {
  message: string
  data: Partial<IExercise>[]
}

export interface DeleteExerciseResponse {
  message: string
}
