import { ObjectId } from 'mongodb'

interface IMessage {
  _id: ObjectId
  senderId: ObjectId
  senderAvatarUrl?: string
  senderName: string
  senderRole: 'member' | 'admin'
  message: string
  timestamp: Date | number
  isRead: boolean
  isDeleted: boolean
}

interface IThread {
  _id: ObjectId
  roomId: string
  userId: ObjectId
  avatarUrl?: string
  title: string
  type: 'general' | 'nutrition' | 'workout' | 'lifestyle' | 'other'
  messages: IMessage[]
  createdAt: Date | number
  updatedAt: Date | number | null
}

interface CreateThreadRequest {
  title: string
  type: 'general' | 'nutrition' | 'workout' | 'lifestyle' | 'other'
  message: string
}

interface CreateThreadResponse {
  message: string
  data: Partial<IThread>
}

export type { IThread, IMessage, CreateThreadRequest, CreateThreadResponse }
