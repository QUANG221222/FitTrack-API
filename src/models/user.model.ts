import { GET_DB } from '~/configs/mongodb'
import { ObjectId } from 'mongodb'
import Joi from 'joi'
import { IUser } from '~/types/user.type'
import { EMAIL_RULE, PASSWORD_RULE, USER_ROLES } from '~/utils/validator'

const COLLECTION_NAME = 'users'

const USER_COLLECTION_SCHEMA: Joi.ObjectSchema<IUser> = Joi.object({
  email: Joi.string().pattern(EMAIL_RULE).required(),
  password: Joi.string().pattern(PASSWORD_RULE).required(),
  displayName: Joi.string().min(3).max(100).required(),
  role: Joi.string().default(USER_ROLES.MEMBER),
  isActive: Joi.boolean().default(true),
  verifyToken: Joi.string().optional(),
  heightCm: Joi.number().optional().allow(null),
  weightKg: Joi.number().optional().allow(null),
  dob: Joi.date().optional().allow(null),
  gender: Joi.string().optional().allow(null),
  avatar: Joi.string().optional().allow(null),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})

const createNew = async (userData: Partial<IUser>): Promise<any> => {
  try {
    const validatedData = await USER_COLLECTION_SCHEMA.validateAsync(userData, {
      abortEarly: false
    })

    const createdUser = await GET_DB()
      .collection(COLLECTION_NAME)
      .insertOne(validatedData)

    return createdUser
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const findOneByEmail = async (email: string): Promise<IUser | null> => {
  try {
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne({ email: email })

    return result as IUser | null
  } catch (error: any) {
    throw new Error(error)
  }
}

const findOneById = async (id: string): Promise<IUser | null> => {
  try {
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) })
    return result as IUser | null
  } catch (error: any) {
    throw new Error(error)
  }
}

export const userModel = {
  findOneByEmail,
  createNew,
  findOneById
}
