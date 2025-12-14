import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validator'
import { IThread } from '~/types/thread.type'
import { GET_DB } from '~/configs/mongodb'
import { ObjectId } from 'mongodb'

const COLLECTION_NAME = 'threads'
const COLLECTION_SCHEMA: Joi.ObjectSchema<IThread> = Joi.object({
  _id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  roomId: Joi.string().required(),
  userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  avatarUrl: Joi.string().uri().optional(),
  title: Joi.string().required().min(2).max(200),
  type: Joi.string()
    .valid('general', 'nutrition', 'workout', 'lifestyle', 'other')
    .required(),
  messages: Joi.array().items(
    Joi.object({
      _id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
      senderId: Joi.string()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE)
        .required(),
      senderName: Joi.string().required(),
      senderRole: Joi.string().valid('member', 'admin').required(),
      senderAvatarUrl: Joi.string().uri().optional(),
      message: Joi.string().required(),
      timestamp: Joi.date().timestamp('javascript').default(Date.now),
      isRead: Joi.boolean().default(false),
      isDeleted: Joi.boolean().default(false)
    })
  ),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})

const createChatRoom = async (data: Partial<IThread>): Promise<any> => {
  try {
    const validatedData = await COLLECTION_SCHEMA.validateAsync(data, {
      abortEarly: false
    })

    validatedData.userId = new ObjectId(validatedData.userId as any)
    validatedData.messages = validatedData.messages.map((msg) => ({
      ...msg,
      senderId: new ObjectId(msg.senderId as any),
      _id: new ObjectId(msg._id as any)
    }))

    return await GET_DB().collection(COLLECTION_NAME).insertOne(validatedData)
  } catch (error: any) {
    throw new Error(error)
  }
}

const findById = async (id: string): Promise<IThread | null> => {
  try {
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) })
    return result as IThread | null
  } catch (error: any) {
    throw new Error(error)
  }
}

const findChatByRoomId = async (roomId: string): Promise<IThread | null> => {
  try {
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne({ roomId: roomId })
    return result as IThread | null
  } catch (error: any) {
    throw new Error(error)
  }
}

const findChatByUserId = async (userId: string): Promise<IThread | null> => {
  try {
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne({ userId: userId })
    return result as IThread | null
  } catch (error: any) {
    throw new Error(error)
  }
}

const addMessage = async (roomId: string, message: any): Promise<any> => {
  try {
    message.senderId = new ObjectId(message.senderId as any)
    message._id = new ObjectId(message._id as any)

    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .updateOne(
        { roomId: roomId },
        {
          $push: { messages: message },
          $set: {
            updatedAt: Date.now()
          }
        }
      )
    return result
  } catch (error: any) {
    throw new Error(error)
  }
}

const countMessagesInRoom = async (roomId: string): Promise<number> => {
  try {
    const pipeline = [
      { $match: { roomId: roomId } },
      { $unwind: '$messages' },
      { $count: 'messageCount' }
    ]
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .aggregate(pipeline)
      .toArray()

    return result[0]?.messageCount || 0
  } catch (error: any) {
    throw new Error(error)
  }
}

const deleteMessage = async (
  roomId: string,
  messageId: string
): Promise<any> => {
  try {
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .updateOne(
        { roomId: roomId, 'messages._id': new ObjectId(messageId) },
        {
          $set: {
            'messages.$.isDeleted': true,
            'messages.$.message': 'This message has been deleted',
            updatedAt: Date.now()
          }
        }
      )
    return result
  } catch (error: any) {
    throw new Error(error)
  }
}

const deleteThread = async (threadId: string): Promise<any> => {
  try {
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(threadId) })
    return result
  } catch (error: any) {
    throw new Error(error)
  }
}

const getAllThreads = async (): Promise<IThread[]> => {
  try {
    const result = await GET_DB().collection(COLLECTION_NAME).find().toArray()
    return result as IThread[]
  } catch (error: any) {
    throw new Error(error)
  }
}

export const threadModel = {
  createChatRoom,
  findChatByRoomId,
  findChatByUserId,
  addMessage,
  countMessagesInRoom,
  deleteMessage,
  deleteThread,
  getAllThreads,
  findById
}
