import { GET_DB } from '~/configs/mongodb'
import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validator'
import Joi from 'joi'
import { IGoal } from '~/types/goal.type'

const COLLECTION_NAME = 'goals'

const GOAL_COLLECTION_SCHEMA = Joi.object<IGoal>({
  _id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  userId: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .required(),
  goalType: Joi.string()
    .valid(
      'weight',
      'body_fat_pct',
      'sessions_per_week',
      'one_rm',
      'strength',
      'endurance',
      'flexibility'
    )
    .required(),
  targetValue: Joi.number().required(),
  unit: Joi.string().max(50).optional().allow(''),
  startValue: Joi.number().optional().allow(null),
  startDate: Joi.date().optional().allow(null),
  targetDate: Joi.date().optional().allow(null),
  status: Joi.string()
    .valid('active', 'achieved', 'abandoned')
    .default('active'),
  note: Joi.string().max(1000).optional().allow(''),
  metricCode: Joi.string().max(100).optional().allow(''),
  exerciseId: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .optional()
    .allow(null),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})

const INVALID_UPDATE_FIELDS = ['_id', 'userId', 'createdAt']

const createNew = async (goalData: Partial<IGoal>): Promise<any> => {
  try {
    const validatedData = await GOAL_COLLECTION_SCHEMA.validateAsync(goalData, {
      abortEarly: false
    })

    // Convert string IDs to ObjectIds
    validatedData.userId = new ObjectId(validatedData.userId as any)

    if (validatedData.exerciseId) {
      validatedData.exerciseId = new ObjectId(validatedData.exerciseId as any)
    }

    const createdGoal = await GET_DB()
      .collection(COLLECTION_NAME)
      .insertOne(validatedData)

    return createdGoal
  } catch (error) {
    throw new Error(error as any)
  }
}

const findOneById = async (id: string): Promise<IGoal | null> => {
  try {
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) })

    return result as IGoal | null
  } catch (error) {
    throw new Error(error as any)
  }
}

const findAll = async (filters?: any): Promise<IGoal[]> => {
  try {
    const query: any = {}

    // Filter by userId
    if (filters?.userId) {
      query.userId = new ObjectId(filters.userId)
    }

    // Filter by goalType
    if (filters?.goalType) {
      query.goalType = filters.goalType
    }

    // Filter by status
    if (filters?.status) {
      query.status = filters.status
    }

    // Filter by exerciseId
    if (filters?.exerciseId) {
      query.exerciseId = new ObjectId(filters.exerciseId)
    }

    // Filter by date range
    if (filters?.startDate || filters?.endDate) {
      query.targetDate = {}

      if (filters.startDate) {
        query.targetDate.$gte = new Date(filters.startDate)
      }

      if (filters.endDate) {
        query.targetDate.$lte = new Date(filters.endDate)
      }
    }

    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .find(query)
      .sort({ createdAt: -1 })
      .toArray()

    return result as IGoal[]
  } catch (error) {
    throw new Error(error as any)
  }
}

const update = async (
  id: string,
  updateData: Partial<IGoal>
): Promise<IGoal | null> => {
  try {
    // Remove invalid fields
    Object.keys(updateData).forEach((key) => {
      if (INVALID_UPDATE_FIELDS.includes(key)) {
        delete (updateData as any)[key]
      }
    })

    // Convert exerciseId to ObjectId if provided
    if (updateData.exerciseId) {
      updateData.exerciseId = new ObjectId(updateData.exerciseId as any)
    }

    // Set updatedAt timestamp
    updateData.updatedAt = Date.now() as any

    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      )

    return result as IGoal | null
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

export const goalModel = {
  createNew,
  findOneById,
  findAll,
  update,
  deleteOne
}
