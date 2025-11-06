import { GET_DB } from '~/configs/mongodb'
import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validator'
import Joi from 'joi'
import { IProgressPhoto } from '~/types/progressPhoto.type'

const COLLECTION_NAME = 'progress_photos'

const PROGRESS_PHOTO_COLLECTION_SCHEMA = Joi.object<IProgressPhoto>({
  _id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  userId: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .required(),
  takenAt: Joi.date().default(Date.now),
  view: Joi.string().valid('front', 'side', 'back').required(),
  imageUrl: Joi.string().uri().required(),
  imagePublicId: Joi.string().optional().allow(null),
  note: Joi.string().max(500).optional().allow(''),
  blurhash: Joi.string().optional().allow(''),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})

const INVALID_UPDATE_FIELDS = ['_id', 'userId', 'createdAt']

const createNew = async (
  progressPhotoData: Partial<IProgressPhoto>
): Promise<any> => {
  try {
    const validatedData = await PROGRESS_PHOTO_COLLECTION_SCHEMA.validateAsync(
      progressPhotoData,
      {
        abortEarly: false
      }
    )

    // Convert string ID to ObjectId
    validatedData.userId = new ObjectId(validatedData.userId as any)

    const createdProgressPhoto = await GET_DB()
      .collection(COLLECTION_NAME)
      .insertOne(validatedData)

    return createdProgressPhoto
  } catch (error) {
    throw new Error(error as any)
  }
}

const findOneById = async (id: string): Promise<IProgressPhoto | null> => {
  try {
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) })

    return result as IProgressPhoto | null
  } catch (error) {
    throw new Error(error as any)
  }
}

const findAll = async (filters?: any): Promise<IProgressPhoto[]> => {
  try {
    const query: any = {}

    // Filter by userId
    if (filters?.userId) {
      query.userId = new ObjectId(filters.userId)
    }

    // Filter by view
    if (filters?.view) {
      query.view = filters.view
    }

    // Filter by date range
    if (filters?.startDate || filters?.endDate) {
      query.takenAt = {}

      if (filters.startDate) {
        query.takenAt.$gte = new Date(filters.startDate)
      }

      if (filters.endDate) {
        query.takenAt.$lte = new Date(filters.endDate)
      }
    }

    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .find(query)
      .sort({ takenAt: -1 })
      .toArray()

    return result as IProgressPhoto[]
  } catch (error) {
    throw new Error(error as any)
  }
}

const update = async (
  id: string,
  updateData: Partial<IProgressPhoto>
): Promise<IProgressPhoto | null> => {
  try {
    // Remove invalid fields
    Object.keys(updateData).forEach((key) => {
      if (INVALID_UPDATE_FIELDS.includes(key)) {
        delete (updateData as any)[key]
      }
    })

    // Set updatedAt timestamp
    updateData.updatedAt = Date.now() as any

    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      )

    return result as IProgressPhoto | null
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

export const progressPhotoModel = {
  createNew,
  findOneById,
  findAll,
  update,
  deleteOne
}
