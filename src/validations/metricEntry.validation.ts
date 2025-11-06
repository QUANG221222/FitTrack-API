import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validator'

// Validate metric entry creation request
const createNew = async (req: Request, _res: Response, next: NextFunction) => {
  const correctCondition = Joi.object({
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
      .required()
      .messages({
        'any.only':
          'Metric code must be one of: weight, height, body_fat, muscle_mass, BMI, waist_circumference, hip_circumference, blood_pressure, heart_rate',
        'any.required': 'Metric code is required'
      }),
    value: Joi.number().required().messages({
      'number.base': 'Value must be a number',
      'any.required': 'Value is required'
    }),
    unit: Joi.string()
      .valid('kg', 'cm', '%', 'l', 'bpm', 'mmHg')
      .required()
      .messages({
        'any.only': 'Unit must be one of: kg, cm, %, l, bpm, mmHg',
        'any.required': 'Unit is required'
      }),
    note: Joi.string().max(500).optional().allow('').messages({
      'string.max': 'Note must be at most 500 characters long'
    }),
    measureAt: Joi.date().optional().messages({
      'date.base': 'Measure at must be a valid date'
    })
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

// Validate metric entry update request
const update = async (req: Request, _res: Response, next: NextFunction) => {
  const correctCondition = Joi.object({
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
      .optional()
      .messages({
        'any.only':
          'Metric code must be one of: weight, height, body_fat, muscle_mass, BMI, waist_circumference, hip_circumference, blood_pressure, heart_rate'
      }),
    value: Joi.number().optional().messages({
      'number.base': 'Value must be a number'
    }),
    unit: Joi.string()
      .valid('kg', 'cm', '%', 'l', 'bpm', 'mmHg')
      .optional()
      .messages({
        'any.only': 'Unit must be one of: kg, cm, %, l, bpm, mmHg'
      }),
    note: Joi.string().max(500).optional().allow('').messages({
      'string.max': 'Note must be at most 500 characters long'
    }),
    measureAt: Joi.date().optional().messages({
      'date.base': 'Measure at must be a valid date'
    })
  })

  try {
    // Validate params
    const paramsSchema = Joi.object({
      id: Joi.string()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE)
        .required()
    })
    await paramsSchema.validateAsync(req.params, { abortEarly: false })

    // Validate body
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

// Validate metric entry ID parameter
const validateId = async (req: Request, _res: Response, next: NextFunction) => {
  const correctCondition = Joi.object({
    id: Joi.string()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
      .required()
  })

  try {
    await correctCondition.validateAsync(req.params, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const metricEntryValidation = {
  createNew,
  update,
  validateId
}
