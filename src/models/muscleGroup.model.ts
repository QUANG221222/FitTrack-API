import { GET_DB } from '~/configs/mongodb'
import { ObjectId } from 'mongodb'
import Joi from 'joi'
import { IMuscleGroup } from '~/types/muscleGroup.type'

const COLLECTION_NAME = 'muscle_groups'

const MUSCLE_GROUP_COLLECTION_SCHEMA = Joi.object<IMuscleGroup>({
  _id: Joi.string().optional(),
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(500).optional().allow(''),
  imageUrl: Joi.string().uri().optional().allow(null),
  imagePublicId: Joi.string().optional().allow(null),
  createdAt: Joi.date().default(Date.now),
  updatedAt: Joi.date().default(Date.now)
})

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

const createNew = async (
  muscleGroupData: Partial<IMuscleGroup>
): Promise<any> => {
  try {
    const validatedData = await MUSCLE_GROUP_COLLECTION_SCHEMA.validateAsync(
      muscleGroupData,
      {
        abortEarly: false
      }
    )

    const createdMuscleGroup = await GET_DB()
      .collection(COLLECTION_NAME)
      .insertOne(validatedData)

    return createdMuscleGroup
  } catch (error) {
    throw new Error(error as any)
  }
}

const findOneByName = async (name: string): Promise<IMuscleGroup | null> => {
  try {
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } })

    return result as IMuscleGroup | null
  } catch (error) {
    throw new Error(error as any)
  }
}

const findOneById = async (id: string): Promise<IMuscleGroup | null> => {
  try {
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) })

    return result as IMuscleGroup | null
  } catch (error) {
    throw new Error(error as any)
  }
}

const findAll = async (): Promise<IMuscleGroup[]> => {
  try {
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    return result as IMuscleGroup[]
  } catch (error) {
    throw new Error(error as any)
  }
}

const update = async (
  id: string,
  updateData: Partial<IMuscleGroup>
): Promise<IMuscleGroup | null> => {
  try {
    // Remove invalid fields
    Object.keys(updateData).forEach((key) => {
      if (INVALID_UPDATE_FIELDS.includes(key)) {
        delete (updateData as any)[key]
      }
    })

    // Set updatedAt timestamp
    updateData.updatedAt = new Date()

    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      )

    return result as IMuscleGroup | null
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

export const muscleGroupModel = {
  createNew,
  findOneByName,
  findOneById,
  findAll,
  update,
  deleteOne
}
