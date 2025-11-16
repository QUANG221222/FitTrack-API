import { ObjectId } from 'mongodb'

export type GoalType =
  | 'weight'
  | 'body_fat_pct'
  | 'sessions_per_week'
  | 'one_rm'
  | 'strength'
  | 'endurance'
  | 'flexibility'

export type GoalStatus = 'active' | 'achieved' | 'abandoned'

export interface IGoal {
  _id?: ObjectId
  userId: ObjectId
  goalType: GoalType
  targetValue: number
  unit?: string
  startValue?: number
  startDate?: Date
  targetDate?: Date
  status: GoalStatus
  note?: string 
  metricCode?: string
  exerciseId?: ObjectId
  createdAt: Date
  updatedAt: Date | null
}

export interface CreateGoalRequest {
  goalType: GoalType
  targetValue: number
  unit?: string
  startValue?: number
  startDate?: Date
  targetDate?: Date
  note?: string
  metricCode?: string
  exerciseId?: string
}

export interface CreateGoalResponse {
  message: string
  data: Partial<IGoal>
}

export interface UpdateGoalRequest {
  goalType?: GoalType
  targetValue?: number
  unit?: string
  startValue?: number
  startDate?: Date
  targetDate?: Date
  status?: GoalStatus
  note?: string
  metricCode?: string
  exerciseId?: string
}

export interface UpdateGoalResponse {
  message: string
  data: Partial<IGoal>
}

export interface GetGoalResponse {
  message: string
  data: Partial<IGoal>
}

export interface GetAllGoalsResponse {
  message: string
  data: Partial<IGoal>[]
}

export interface DeleteGoalResponse {
  message: string
}
