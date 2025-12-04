import { GET_DB } from '~/configs/mongodb'
import { ObjectId } from 'mongodb'
import Joi from 'joi'
import { IAdmin } from '~/types/admin.type'
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE,
  USER_ROLES
} from '~/utils/validator'

const COLLECTION_NAME = 'admins'
const ADMIN_COLLECTION_SCHEMA = Joi.object<IAdmin>({
  _id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  email: Joi.string()
    .pattern(EMAIL_RULE)
    .message(EMAIL_RULE_MESSAGE)
    .required(),
  password: Joi.string()
    .min(6)
    .pattern(PASSWORD_RULE)
    .message(PASSWORD_RULE_MESSAGE)
    .required(),
  displayName: Joi.string().min(2).max(100).required(),
  phoneNumber: Joi.string().allow(null).optional(),
  bio: Joi.string().allow(null).optional(),
  location: Joi.string().allow(null).optional(),
  dob: Joi.date().allow(null).optional(),
  gender: Joi.string().allow(null).optional(),
  heightCm: Joi.number().allow(null).optional(),
  weightKg: Joi.number().allow(null).optional(),
  role: Joi.string()
    .default(USER_ROLES.ADMIN)
    .valid(...Object.values(USER_ROLES)),
  isActive: Joi.boolean().default(false),
  verifyToken: Joi.string().allow('').optional(),
  avatar: Joi.string().uri().allow(null).optional(),
  avatarPublicId: Joi.string().allow(null).optional(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})
const INVALID_UPDATE_FIELDS = ['_id', 'email', 'role', 'createdAt']

const createNew = async (adminData: Partial<IAdmin>): Promise<any> => {
  try {
    const validatedData = await ADMIN_COLLECTION_SCHEMA.validateAsync(
      adminData,
      {
        abortEarly: false
      }
    )

    const createdAdmin = await GET_DB()
      .collection(COLLECTION_NAME)
      .insertOne(validatedData)

    return createdAdmin
  } catch (error) {
    throw new Error(error as any)
  }
}

const findOneByEmail = async (email: string): Promise<IAdmin | null> => {
  try {
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne({ email: email })

    return result as IAdmin | null
  } catch (error) {
    throw new Error(error as any)
  }
}

const findOneById = async (id: string): Promise<IAdmin | null> => {
  try {
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) })

    return result as IAdmin | null
  } catch (error) {
    throw new Error(error as any)
  }
}

const update = async (
  id: string,
  updateData: Partial<IAdmin>
): Promise<IAdmin | null> => {
  try {
    Object.keys(updateData).forEach((key) => {
      if (INVALID_UPDATE_FIELDS.includes(key)) {
        delete (updateData as any)[key]
      }
    })

    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      )

    return result as IAdmin | null
  } catch (error) {
    throw new Error(error as any)
  }
}

export const adminModel = {
  findOneByEmail,
  createNew,
  findOneById,
  update
}
