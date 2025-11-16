import { GET_DB } from '~/configs/mongodb'
import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validator'
import Joi from 'joi'
import {
  IWorkoutPlan,
  IWorkoutPlanItem,
  IWorkoutPlanDay
} from '~/types/workoutPlan.type'

const COLLECTION_NAME = 'workout_plans'

const WORKOUT_PLAN_ITEM_SCHEMA = Joi.object<IWorkoutPlanItem>({
  //   _id: Joi.string()
  //     .pattern(OBJECT_ID_RULE)
  //     .message(OBJECT_ID_RULE_MESSAGE)
  //     .optional(),
  exerciseId: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .required(),
  targetSets: Joi.number().min(1).required(),
  repsMin: Joi.number().min(1).required(),
  repsMax: Joi.number().min(1).required(),
  targetWeight: Joi.number().min(0).required(),
  tempo: Joi.string().optional().allow(''),
  restSec: Joi.number().min(0).optional(),
  order: Joi.number().min(0).optional()
})

const WORKOUT_PLAN_DAY_SCHEMA = Joi.object<IWorkoutPlanDay>({
  dow: Joi.number().min(0).max(6).required(),
  note: Joi.string().optional().allow(''),
  items: Joi.array().items(WORKOUT_PLAN_ITEM_SCHEMA).default([])
})

const WORKOUT_PLAN_COLLECTION_SCHEMA = Joi.object<IWorkoutPlan>({
  _id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  userId: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .required(),
  name: Joi.string().min(2).max(200).required(),
  goalHint: Joi.string().max(1000).optional().allow(''),
  startDate: Joi.date().optional().allow(null),
  endDate: Joi.date().optional().allow(null),
  isActive: Joi.boolean().default(true),
  days: Joi.array().items(WORKOUT_PLAN_DAY_SCHEMA).default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})

const INVALID_UPDATE_FIELDS = ['_id', 'userId', 'createdAt']

const createNew = async (
  workoutPlanData: Partial<IWorkoutPlan>
): Promise<any> => {
  try {
    const validatedData = await WORKOUT_PLAN_COLLECTION_SCHEMA.validateAsync(
      workoutPlanData,
      {
        abortEarly: false
      }
    )

    // Convert string IDs to ObjectIds
    validatedData.userId = new ObjectId(validatedData.userId as any)

    // Convert exerciseIds in days items to ObjectIds
    if (validatedData.days && validatedData.days.length > 0) {
      validatedData.days = validatedData.days.map((day: any) => ({
        ...day,
        items: day.items.map((item: any) => ({
          ...item,
          //   _id: new ObjectId(),
          exerciseId: new ObjectId(item.exerciseId)
        }))
      }))
    }

    const createdWorkoutPlan = await GET_DB()
      .collection(COLLECTION_NAME)
      .insertOne(validatedData)

    return createdWorkoutPlan
  } catch (error) {
    throw new Error(error as any)
  }
}

const findOneById = async (id: string): Promise<IWorkoutPlan | null> => {
  try {
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) })

    return result as IWorkoutPlan | null
  } catch (error) {
    throw new Error(error as any)
  }
}

const findAll = async (filters?: any): Promise<IWorkoutPlan[]> => {
  try {
    const query: any = {}

    // Filter by userId
    if (filters?.userId) {
      query.userId = new ObjectId(filters.userId)
    }

    // Filter by isActive
    if (filters?.isActive !== undefined) {
      query.isActive = filters.isActive
    }

    // Filter by date range
    if (filters?.startDate || filters?.endDate) {
      query.$or = []

      if (filters.startDate) {
        query.$or.push({
          startDate: { $gte: new Date(filters.startDate) }
        })
      }

      if (filters.endDate) {
        query.$or.push({
          endDate: { $lte: new Date(filters.endDate) }
        })
      }
    }

    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .find(query)
      .sort({ createdAt: -1 })
      .toArray()

    return result as IWorkoutPlan[]
  } catch (error) {
    throw new Error(error as any)
  }
}

const findOneByName = async (name: string): Promise<IWorkoutPlan | null> => {
  try {
    const result = await GET_DB().collection(COLLECTION_NAME).findOne({ name })

    return result as IWorkoutPlan | null
  } catch (error) {
    throw new Error(error as any)
  }
}

const update = async (
  id: string,
  updateData: Partial<IWorkoutPlan>
): Promise<IWorkoutPlan | null> => {
  try {
    // Remove invalid fields
    Object.keys(updateData).forEach((key) => {
      if (INVALID_UPDATE_FIELDS.includes(key)) {
        delete (updateData as any)[key]
      }
    })

    // Convert exerciseIds in days items to ObjectIds if days are being updated
    if (updateData.days && updateData.days.length > 0) {
      updateData.days = updateData.days.map((day: any) => ({
        ...day,
        items: day.items.map((item: any) => ({
          ...item,
          //   _id: item._id ? new ObjectId(item._id) : new ObjectId(),
          exerciseId: new ObjectId(item.exerciseId)
        }))
      }))
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

    return result as IWorkoutPlan | null
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

const deactivateAllForUser = async (
  userId: string,
  exceptId?: string
): Promise<any> => {
  try {
    const query: any = {
      userId: new ObjectId(userId),
      isActive: true
    }

    // Exclude the plan being updated (if provided)
    if (exceptId) {
      query._id = { $ne: new ObjectId(exceptId) }
    }

    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .updateMany(query, {
        $set: {
          isActive: false,
          updatedAt: Date.now()
        }
      })

    return result
  } catch (error) {
    throw error
  }
}

export const workoutPlanModel = {
  createNew,
  findOneById,
  findAll,
  update,
  deleteOne,
  findOneByName,
  deactivateAllForUser
}
