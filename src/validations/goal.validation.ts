import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validator'

// Validate goal creation request
const createNew = async (req: Request, _res: Response, next: NextFunction) => {
  const correctCondition = Joi.object({
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
      .required()
      .messages({
        'any.only':
          'Goal type must be one of: weight, body_fat_pct, sessions_per_week, one_rm, strength, endurance, flexibility',
        'any.required': 'Goal type is required'
      }),
    targetValue: Joi.number().required().messages({
      'number.base': 'Target value must be a number',
      'any.required': 'Target value is required'
    }),
    unit: Joi.string().max(50).optional().allow('').messages({
      'string.max': 'Unit must be at most 50 characters long'
    }),
    startValue: Joi.number().optional().allow(null).messages({
      'number.base': 'Start value must be a number'
    }),
    startDate: Joi.date().optional().allow(null).messages({
      'date.base': 'Start date must be a valid date'
    }),
    targetDate: Joi.date().optional().allow(null).messages({
      'date.base': 'Target date must be a valid date'
    }),
    note: Joi.string().max(1000).optional().allow('').messages({
      'string.max': 'Note must be at most 1000 characters long'
    }),
    metricCode: Joi.string().max(100).optional().allow('').messages({
      'string.max': 'Metric code must be at most 100 characters long'
    }),
    exerciseId: Joi.string()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
      .optional()
      .allow(null)
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

// Validate goal update request
const update = async (req: Request, _res: Response, next: NextFunction) => {
  const correctCondition = Joi.object({
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
      .optional()
      .messages({
        'any.only':
          'Goal type must be one of: weight, body_fat_pct, sessions_per_week, one_rm, strength, endurance, flexibility'
      }),
    targetValue: Joi.number().optional().messages({
      'number.base': 'Target value must be a number'
    }),
    unit: Joi.string().max(50).optional().allow('').messages({
      'string.max': 'Unit must be at most 50 characters long'
    }),
    startValue: Joi.number().optional().allow(null).messages({
      'number.base': 'Start value must be a number'
    }),
    startDate: Joi.date().optional().allow(null).messages({
      'date.base': 'Start date must be a valid date'
    }),
    targetDate: Joi.date().optional().allow(null).messages({
      'date.base': 'Target date must be a valid date'
    }),
    status: Joi.string()
      .valid('active', 'achieved', 'abandoned')
      .optional()
      .messages({
        'any.only': 'Status must be one of: active, achieved, abandoned'
      }),
    note: Joi.string().max(1000).optional().allow('').messages({
      'string.max': 'Note must be at most 1000 characters long'
    }),
    metricCode: Joi.string().max(100).optional().allow('').messages({
      'string.max': 'Metric code must be at most 100 characters long'
    }),
    exerciseId: Joi.string()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
      .optional()
      .allow(null)
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

// Validate goal ID parameter
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

export const goalValidation = {
  createNew,
  update,
  validateId
}
