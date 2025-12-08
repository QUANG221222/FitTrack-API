import { GET_DB } from '~/configs/mongodb'
import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validator'
import Joi from 'joi'
import { IExercise } from '~/types/exercise.type'

const COLLECTION_NAME = 'exercises'

const EXERCISE_COLLECTION_SCHEMA = Joi.object<IExercise>({
  _id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  adminId: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .required(),
  name: Joi.string().min(2).max(200).required(),
  description: Joi.string().max(1000).optional().allow(''),
  type: Joi.string()
    .valid('strength', 'cardio', 'mobility', 'flexibility', 'calisthenics')
    .required(),
  difficulty: Joi.string()
    .valid('beginner', 'intermediate', 'advance')
    .default('beginner'),
  equipment: Joi.string().max(200).optional().allow(''),
  mediaVideoUrl: Joi.string().uri().optional().allow(''),
  mediaVideoPublicId: Joi.string().optional().allow(''),
  mediaImageUrl: Joi.string().uri().optional().allow(null),
  mediaImagePublicId: Joi.string().optional().allow(null),
  primaryMuscles: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .min(1)
    .required(),
  secondaryMuscles: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  isPublic: Joi.boolean().default(true),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})

const INVALID_UPDATE_FIELDS = ['_id', 'adminId', 'createdAt']

const createNew = async (exerciseData: Partial<IExercise>): Promise<any> => {
  try {
    const validatedData = await EXERCISE_COLLECTION_SCHEMA.validateAsync(
      exerciseData,
      {
        abortEarly: false
      }
    )

    // Convert validatedData IDs to ObjectIds
    validatedData.adminId = new ObjectId(validatedData.adminId as any)
    validatedData.primaryMuscles = (validatedData.primaryMuscles as any).map(
      (id: string) => new ObjectId(id)
    )
    validatedData.secondaryMuscles = (
      validatedData.secondaryMuscles as any
    ).map((id: string) => new ObjectId(id))

    const createdExercise = await GET_DB()
      .collection(COLLECTION_NAME)
      .insertOne(validatedData)

    return createdExercise
  } catch (error) {
    throw new Error(error as any)
  }
}

const findOneByName = async (name: string): Promise<IExercise | null> => {
  try {
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } })

    return result as IExercise | null
  } catch (error) {
    throw new Error(error as any)
  }
}

const findOneById = async (id: string): Promise<IExercise | null> => {
  try {
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) })

    return result as IExercise | null
  } catch (error) {
    throw new Error(error as any)
  }
}

const findAll = async (filters?: any): Promise<IExercise[]> => {
  try {
    const query: any = {}

    // Filter by type
    if (filters?.type) {
      query.type = filters.type
    }

    // Filter by difficulty
    if (filters?.difficulty) {
      query.difficulty = filters.difficulty
    }

    // Filter by public/private
    if (filters?.isPublic !== undefined) {
      query.isPublic = filters.isPublic
    }

    // Filter by adminId
    if (filters?.adminId) {
      query.adminId = new ObjectId(filters.adminId)
    }

    // Filter by muscle groups
    if (filters?.muscleGroupId) {
      query.$or = [
        { primaryMuscles: new ObjectId(filters.muscleGroupId) },
        { secondaryMuscles: new ObjectId(filters.muscleGroupId) }
      ]
    }

    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .find(query)
      .sort({ createdAt: -1 })
      .toArray()

    return result as IExercise[]
  } catch (error) {
    throw new Error(error as any)
  }
}

const update = async (
  id: string,
  updateData: Partial<IExercise>
): Promise<IExercise | null> => {
  try {
    // Remove invalid fields
    Object.keys(updateData).forEach((key) => {
      if (INVALID_UPDATE_FIELDS.includes(key)) {
        delete (updateData as any)[key]
      }
    })

    // Convert string IDs to ObjectIds if present
    if (updateData.primaryMuscles) {
      updateData.primaryMuscles = (updateData.primaryMuscles as any).map(
        (id: string) => new ObjectId(id)
      )
    }
    if (updateData.secondaryMuscles) {
      updateData.secondaryMuscles = (updateData.secondaryMuscles as any).map(
        (id: string) => new ObjectId(id)
      )
    }

    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      )

    return result as IExercise | null
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

const countExercises = async (): Promise<number> => {
  try {
    const total = await GET_DB().collection(COLLECTION_NAME).countDocuments()
    return total
  } catch (error) {
    throw new Error(error as any)
  }
}

const countExercisesByType = async (): Promise<any[]> => {
  try {
    const pipeline = [
      {
        $group: {
          _id: '$type',
          total: { $sum: 1 }
        }
      }
    ]

    const result = await GET_DB().collection(COLLECTION_NAME).aggregate(pipeline).toArray()

    return result.map(item => ({
      name: item._id,
      value: item.total
    }))
  } catch (error: any) {
    throw new Error(error)
  }
}

export const exerciseModel = {
  createNew,
  findOneByName,
  findOneById,
  findAll,
  update,
  deleteOne,
  countExercises,
  countExercisesByType
}
