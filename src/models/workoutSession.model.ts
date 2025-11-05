import { GET_DB } from '~/configs/mongodb'
import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validator'
import Joi from 'joi'
import {
  IWorkoutSession,
  IWorkoutSessionExercise,
  IWorkoutSessionSet
} from '~/types/workoutSession.type'

const COLLECTION_NAME = 'workout_sessions'

const WORKOUT_SESSION_SET_SCHEMA = Joi.object<IWorkoutSessionSet>({
  setNo: Joi.number().min(1).required(),
  reps: Joi.number().min(0).required(),
  weight: Joi.number().min(0).required(),
  rpe: Joi.number().min(0).max(10).optional(),
  distanceM: Joi.number().min(0).optional(),
  durationSec: Joi.number().min(0).optional(),
  isWarmup: Joi.boolean().optional()
})

const WORKOUT_SESSION_EXERCISE_SCHEMA = Joi.object<IWorkoutSessionExercise>({
  exerciseId: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .required(),
  order: Joi.number().min(0).optional(),
  note: Joi.string().max(500).optional().allow(''),
  sets: Joi.array().items(WORKOUT_SESSION_SET_SCHEMA).default([])
})

const WORKOUT_SESSION_COLLECTION_SCHEMA = Joi.object<IWorkoutSession>({
  _id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  userId: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .required(),
  planId: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .optional()
    .allow(null),
  startTime: Joi.date().required(),
  endTime: Joi.date().required(),
  mood: Joi.string().max(100).optional().allow(''),
  energyLevel: Joi.number().min(1).max(10).optional(),
  note: Joi.string().max(1000).optional().allow(''),
  exercises: Joi.array().items(WORKOUT_SESSION_EXERCISE_SCHEMA).default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})

const INVALID_UPDATE_FIELDS = ['_id', 'userId', 'createdAt']

const createNew = async (
  workoutSessionData: Partial<IWorkoutSession>
): Promise<any> => {
  try {
    const validatedData = await WORKOUT_SESSION_COLLECTION_SCHEMA.validateAsync(
      workoutSessionData,
      {
        abortEarly: false
      }
    )

    // Convert string IDs to ObjectIds
    validatedData.userId = new ObjectId(validatedData.userId as any)

    if (validatedData.planId) {
      validatedData.planId = new ObjectId(validatedData.planId as any)
    }

    // Convert exerciseIds in exercises to ObjectIds
    if (validatedData.exercises && validatedData.exercises.length > 0) {
      validatedData.exercises = validatedData.exercises.map(
        (exercise: any) => ({
          ...exercise,
          exerciseId: new ObjectId(exercise.exerciseId)
        })
      )
    }

    const createdWorkoutSession = await GET_DB()
      .collection(COLLECTION_NAME)
      .insertOne(validatedData)

    return createdWorkoutSession
  } catch (error) {
    throw new Error(error as any)
  }
}

const findOneById = async (id: string): Promise<IWorkoutSession | null> => {
  try {
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) })

    return result as IWorkoutSession | null
  } catch (error) {
    throw new Error(error as any)
  }
}

const findAll = async (filters?: any): Promise<IWorkoutSession[]> => {
  try {
    const query: any = {}

    // Filter by userId
    if (filters?.userId) {
      query.userId = new ObjectId(filters.userId)
    }

    // Filter by planId
    if (filters?.planId) {
      query.planId = new ObjectId(filters.planId)
    }

    // Filter by date range
    if (filters?.startDate || filters?.endDate) {
      query.startTime = {}

      if (filters.startDate) {
        query.startTime.$gte = new Date(filters.startDate)
      }

      if (filters.endDate) {
        query.startTime.$lte = new Date(filters.endDate)
      }
    }

    // Filter by mood
    if (filters?.mood) {
      query.mood = filters.mood
    }

    // Filter by energy level
    if (filters?.energyLevel) {
      query.energyLevel = Number(filters.energyLevel)
    }

    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .find(query)
      .sort({ startTime: -1 })
      .toArray()

    return result as IWorkoutSession[]
  } catch (error) {
    throw new Error(error as any)
  }
}

const update = async (
  id: string,
  updateData: Partial<IWorkoutSession>
): Promise<IWorkoutSession | null> => {
  try {
    // Remove invalid fields
    Object.keys(updateData).forEach((key) => {
      if (INVALID_UPDATE_FIELDS.includes(key)) {
        delete (updateData as any)[key]
      }
    })

    // Convert planId to ObjectId if provided
    if (updateData.planId) {
      updateData.planId = new ObjectId(updateData.planId as any)
    }

    // Convert exerciseIds in exercises to ObjectIds if provided
    if (updateData.exercises && updateData.exercises.length > 0) {
      updateData.exercises = updateData.exercises.map((exercise: any) => ({
        ...exercise,
        exerciseId: new ObjectId(exercise.exerciseId)
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

    return result as IWorkoutSession | null
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

export const workoutSessionModel = {
  createNew,
  findOneById,
  findAll,
  update,
  deleteOne
}
