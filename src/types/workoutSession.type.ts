import { ObjectId } from 'mongodb'

export interface IWorkoutSessionSet {
  setNo: number
  reps: number
  weight: number
  rpe?: number
  distanceM?: number
  durationSec?: number
  isWarmup?: boolean
}

export interface IWorkoutSessionExercise {
  exerciseId: ObjectId
  order?: number
  note?: string
  sets: IWorkoutSessionSet[]
}

export interface IWorkoutSession {
  _id?: ObjectId
  userId: ObjectId
  planId?: ObjectId
  startTime: Date
  endTime: Date
  mood?: string
  energyLevel?: number
  note?: string
  exercises: IWorkoutSessionExercise[]
  createdAt: Date
  updatedAt: Date | null
}

export interface CreateWorkoutSessionRequest {
  planId?: string
  startTime: Date
  endTime: Date
  mood?: string
  energyLevel?: number
  note?: string
  exercises?: IWorkoutSessionExercise[]
}

export interface CreateWorkoutSessionResponse {
  message: string
  data: Partial<IWorkoutSession>
}

export interface UpdateWorkoutSessionRequest {
  planId?: string
  startTime?: Date
  endTime?: Date
  mood?: string
  energyLevel?: number
  note?: string
  exercises?: IWorkoutSessionExercise[]
}

export interface UpdateWorkoutSessionResponse {
  message: string
  data: Partial<IWorkoutSession>
}

export interface GetWorkoutSessionResponse {
  message: string
  data: Partial<IWorkoutSession>
}

export interface GetAllWorkoutSessionsResponse {
  message: string
  data: Partial<IWorkoutSession>[]
}

export interface DeleteWorkoutSessionResponse {
  message: string
}
