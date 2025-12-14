import { Request } from 'express'
import { threadModel } from '~/models/thread.model'
import { userModel } from '~/models/user.model'

const createNewThread = async (req: Request): Promise<any> => {
  try {
    const { title, type, message } = req.body

    // Get userId from JWT token
    const userId = req.jwtDecoded.id

    const user = await userModel.findOneById(userId)

    // Prepare thread data
    const threadData: any = {
      title,
      type,
      userId: userId,
      avatarUrl: user?.avatar,
      roomId: `room_${userId}_${Date.now()}`,
      messages: [
        {
          senderId: userId,
          senderAvatarUrl: user?.avatar,
          senderName: user?.displayName,
          senderRole: user?.role,
          message: message,
          timestamp: Date.now(),
          isRead: false,
          isDeleted: false
        }
      ]
    }

    const result = await threadModel.createChatRoom(threadData)

    const newThread = await threadModel.findById(result.insertedId.toString())

    return newThread
  } catch (error: any) {
    throw error
  }
}

const getAllThreads = async (): Promise<any> => {
  try {
    const threads = await threadModel.getAllThreads()
    return threads
  } catch (error: any) {
    throw error
  }
}

const deleteThread = async (roomId: string): Promise<any> => {
  try {
    const result = await threadModel.deleteThread(roomId)
    return result
  } catch (error: any) {
    throw error
  }
}

export const threadService = { createNewThread, getAllThreads, deleteThread }
