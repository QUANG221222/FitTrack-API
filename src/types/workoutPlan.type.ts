import { ObjectId } from 'mongodb'

export interface IWorkoutPlanItem {
  //   _id?: ObjectId
  exerciseId: ObjectId
  targetSets: number
  repsMin: number
  repsMax: number
  targetWeight: number
  tempo?: string
  restSec?: number
  order?: number
}

export interface IWorkoutPlanDay {
  dow: number // 0-6 (Sunday to Saturday)
  note?: string
  items: IWorkoutPlanItem[]
}

export interface IWorkoutPlan {
  _id?: ObjectId
  userId: ObjectId
  name: string
  goalHint?: string
  startDate?: Date
  endDate?: Date
  isActive: boolean
  days: IWorkoutPlanDay[]
  createdAt: Date
  updatedAt: Date | null
}

export interface CreateWorkoutPlanRequest {
  name: string
  goalHint?: string
  startDate?: Date
  endDate?: Date
  isActive?: boolean
  days?: IWorkoutPlanDay[]
}

export interface CreateWorkoutPlanResponse {
  message: string
  data: Partial<IWorkoutPlan>
}

export interface UpdateWorkoutPlanRequest {
  name?: string
  goalHint?: string
  startDate?: Date
  endDate?: Date
  isActive?: boolean
  days?: IWorkoutPlanDay[]
}

export interface UpdateWorkoutPlanResponse {
  message: string
  data: Partial<IWorkoutPlan>
}

export interface GetWorkoutPlanResponse {
  message: string
  data: Partial<IWorkoutPlan>
}

export interface GetAllWorkoutPlansResponse {
  message: string
  data: Partial<IWorkoutPlan>[]
}

export interface DeleteWorkoutPlanResponse {
  message: string
}
