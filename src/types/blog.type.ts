import { ObjectId } from 'mongodb'

export interface IBlog {
  _id?: ObjectId
  name: string
  description?: string
  content?: string
  createdAt: Date
  updatedAt: Date | null
}

export interface CreateBlogRequest {
  name: string
  description?: string
  content?: string
}

export interface CreateBlogResponse {
  message: string
  data: Partial<IBlog>
}

export interface UpdateBlogRequest {
  name?: string
  description?: string
  content?: string
}

export interface UpdateBlogResponse {
  message: string
  data: Partial<IBlog>
}

export interface GetBlogResponse {
  message: string
  data: Partial<IBlog>
}

export interface GetAllBlogsResponse {
  message: string
  data: Partial<IBlog>[]
}

export interface DeleteBlogResponse {
  message: string
}
