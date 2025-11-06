import { ObjectId } from 'mongodb'

export type PhotoView = 'front' | 'side' | 'back'

export interface IProgressPhoto {
  _id?: ObjectId
  userId: ObjectId
  takenAt: Date
  view: PhotoView
  imageUrl: string
  imagePublicId?: string
  note?: string
  blurhash?: string
  createdAt: Date
  updatedAt: Date | null
}

export interface CreateProgressPhotoRequest {
  takenAt?: Date
  view: PhotoView
  note?: string
  blurhash?: string
}

export interface CreateProgressPhotoResponse {
  message: string
  data: Partial<IProgressPhoto>
}

export interface UpdateProgressPhotoRequest {
  takenAt?: Date
  view?: PhotoView
  note?: string
  blurhash?: string
}

export interface UpdateProgressPhotoResponse {
  message: string
  data: Partial<IProgressPhoto>
}

export interface GetProgressPhotoResponse {
  message: string
  data: Partial<IProgressPhoto>
}

export interface GetAllProgressPhotosResponse {
  message: string
  data: Partial<IProgressPhoto>[]
}

export interface DeleteProgressPhotoResponse {
  message: string
}
