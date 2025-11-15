import { GET_DB } from '~/configs/mongodb'
import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validator'
import Joi from 'joi'
import { IBlog } from '~/types/blog.type'

const COLLECTION_NAME = 'blogs'

const BLOG_COLLECTION_SCHEMA = Joi.object<IBlog>({
  _id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  adminId: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .required(),
  name: Joi.string().min(2).max(200).required(),
  description: Joi.string().max(1000).optional().allow(''),
  content: Joi.string().optional().allow(''),
  type: Joi.string()
    .valid('general', 'nutrition', 'workout', 'lifestyle', 'other')
    .required(),
  thumbnailUrl: Joi.string().uri().optional().allow(''),
  thumbnailPublicId: Joi.string().optional().allow(''),
  likes: Joi.number().integer().min(0).default(0),
  views: Joi.number().integer().min(0).default(0),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})

const INVALID_UPDATE_FIELDS = ['_id', 'adminId', 'createdAt']

const createNew = async (blogData: Partial<IBlog>): Promise<any> => {
  try {
    const validatedData = await BLOG_COLLECTION_SCHEMA.validateAsync(blogData, {
      abortEarly: false
    })

    validatedData.adminId = new ObjectId(validatedData.adminId as any)

    const createdBlog = await GET_DB()
      .collection(COLLECTION_NAME)
      .insertOne(validatedData)

    return createdBlog
  } catch (error) {
    throw new Error(error as any)
  }
}

const findOneByName = async (name: string): Promise<IBlog | null> => {
  try {
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } })

    return result as IBlog | null
  } catch (error) {
    throw new Error(error as any)
  }
}

const findOneById = async (id: string): Promise<IBlog | null> => {
  try {
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) })

    return result as IBlog | null
  } catch (error) {
    throw new Error(error as any)
  }
}

const findAll = async (): Promise<IBlog[]> => {
  try {
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    return result as IBlog[]
  } catch (error) {
    throw new Error(error as any)
  }
}

const update = async (
  id: string,
  updateData: Partial<IBlog>
): Promise<IBlog | null> => {
  try {
    // Remove invalid fields
    Object.keys(updateData).forEach((key) => {
      if (INVALID_UPDATE_FIELDS.includes(key)) {
        delete (updateData as any)[key]
      }
    })

    // Set updatedAt timestamp
    updateData.updatedAt = Date.now() as any
    if (updateData.adminId) {
      updateData.adminId = new ObjectId(updateData.adminId as any)
    }

    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      )

    return result as IBlog | null
  } catch (error) {
    throw new Error(error as any)
  }
}

const deleteOne = async (id: string): Promise<boolean> => {
  try {
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) })

    return result.deletedCount > 0
  } catch (error) {
    throw new Error(error as any)
  }
}

export const blogModel = {
  createNew,
  findOneByName,
  findOneById,
  findAll,
  update,
  deleteOne
}
