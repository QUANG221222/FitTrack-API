import { GET_DB } from '~/configs/mongodb'
import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validator'
import Joi from 'joi'
import { IMetricEntry } from '~/types/metricEntry.type'

const COLLECTION_NAME = 'metric_entries'

const METRIC_ENTRY_COLLECTION_SCHEMA = Joi.object<IMetricEntry>({
  _id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  userId: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .required(),
  metricCode: Joi.string()
    .valid(
      'weight',
      'height',
      'body_fat',
      'muscle_mass',
      'BMI',
      'waist_circumference',
      'hip_circumference',
      'blood_pressure',
      'heart_rate'
    )
    .required(),
  value: Joi.number().required(),
  unit: Joi.string().valid('kg', 'cm', '%', 'l', 'bpm', 'mmHg').required(),
  note: Joi.string().allow('').optional(),
  measureAt: Joi.date().timestamp('javascript').default(Date.now),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})

const INVALID_UPDATE_FIELDS = ['_id', 'userId', 'createdAt']

const createNew = async (
  metricEntryData: Partial<IMetricEntry>
): Promise<any> => {
  try {
    const validatedData = await METRIC_ENTRY_COLLECTION_SCHEMA.validateAsync(
      metricEntryData,
      {
        abortEarly: false
      }
    )

    // Convert string ID to ObjectId
    validatedData.userId = new ObjectId(validatedData.userId as any)

    const createdMetricEntry = await GET_DB()
      .collection(COLLECTION_NAME)
      .insertOne(validatedData)

    return createdMetricEntry
  } catch (error) {
    throw new Error(error as any)
  }
}

const findOneById = async (id: string): Promise<IMetricEntry | null> => {
  try {
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) })

    return result as IMetricEntry | null
  } catch (error) {
    throw new Error(error as any)
  }
}

const findAll = async (filters?: any): Promise<IMetricEntry[]> => {
  try {
    const query: any = {}

    // Filter by userId
    if (filters?.userId) {
      query.userId = new ObjectId(filters.userId)
    }

    // Filter by metricCode
    if (filters?.metricCode) {
      query.metricCode = filters.metricCode
    }

    // Filter by date range
    if (filters?.startDate || filters?.endDate) {
      query.measureAt = {}

      if (filters.startDate) {
        query.measureAt.$gte = new Date(filters.startDate)
      }

      if (filters.endDate) {
        query.measureAt.$lte = new Date(filters.endDate)
      }
    }

    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .find(query)
      .sort({ measureAt: -1 })
      .toArray()

    return result as IMetricEntry[]
  } catch (error) {
    throw new Error(error as any)
  }
}

const update = async (
  id: string,
  updateData: Partial<IMetricEntry>
): Promise<IMetricEntry | null> => {
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

    return result as IMetricEntry | null
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

export const metricEntryModel = {
  createNew,
  findOneById,
  findAll,
  update,
  deleteOne
}
