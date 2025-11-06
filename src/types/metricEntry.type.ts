import { ObjectId } from 'mongodb'

export type MetricCode =
  | 'weight'
  | 'height'
  | 'body_fat'
  | 'muscle_mass'
  | 'BMI'
  | 'waist_circumference'
  | 'hip_circumference'
  | 'blood_pressure'
  | 'heart_rate'

export type MetricUnit = 'kg' | 'cm' | '%' | 'l' | 'bpm' | 'mmHg'

export interface IMetricEntry {
  _id?: ObjectId
  userId: ObjectId
  metricCode: MetricCode
  value: number
  unit: MetricUnit
  note?: string
  measureAt: Date
  createdAt: Date
  updatedAt: Date | null
}

export interface CreateMetricEntryRequest {
  metricCode: MetricCode
  value: number
  unit: MetricUnit
  note?: string
  measureAt?: Date
}

export interface CreateMetricEntryResponse {
  message: string
  data: Partial<IMetricEntry>
}

export interface UpdateMetricEntryRequest {
  metricCode?: MetricCode
  value?: number
  unit?: MetricUnit
  note?: string
  measureAt?: Date
}

export interface UpdateMetricEntryResponse {
  message: string
  data: Partial<IMetricEntry>
}

export interface GetMetricEntryResponse {
  message: string
  data: Partial<IMetricEntry>
}

export interface GetAllMetricEntriesResponse {
  message: string
  data: Partial<IMetricEntry>[]
}

export interface DeleteMetricEntryResponse {
  message: string
}
