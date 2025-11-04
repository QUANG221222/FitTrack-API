import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validator'

// Validate workout plan item
const workoutPlanItemSchema = Joi.object({
  exerciseId: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .required(),
  targetSets: Joi.number().min(1).required().messages({
    'number.min': 'Target sets must be at least 1',
    'any.required': 'Target sets is required'
  }),
  repsMin: Joi.number().min(1).required().messages({
    'number.min': 'Minimum reps must be at least 1',
    'any.required': 'Minimum reps is required'
  }),
  repsMax: Joi.number().min(1).required().messages({
    'number.min': 'Maximum reps must be at least 1',
    'any.required': 'Maximum reps is required'
  }),
  targetWeight: Joi.number().min(0).required().messages({
    'number.min': 'Target weight cannot be negative',
    'any.required': 'Target weight is required'
  }),
  tempo: Joi.string().optional().allow(''),
  restSec: Joi.number().min(0).optional().messages({
    'number.min': 'Rest seconds cannot be negative'
  }),
  order: Joi.number().min(0).optional().messages({
    'number.min': 'Order cannot be negative'
  })
})

// Validate workout plan day
const workoutPlanDaySchema = Joi.object({
  dow: Joi.number().min(0).max(6).required().messages({
    'number.min': 'Day of week must be between 0 and 6',
    'number.max': 'Day of week must be between 0 and 6',
    'any.required': 'Day of week is required'
  }),
  note: Joi.string().max(500).optional().allow('').messages({
    'string.max': 'Note must be at most 500 characters long'
  }),
  items: Joi.array().items(workoutPlanItemSchema).default([])
})

// Validate workout plan creation request
const createNew = async (req: Request, _res: Response, next: NextFunction) => {
  const correctCondition = Joi.object({
    name: Joi.string().min(2).max(200).required().messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must be at most 200 characters long',
      'any.required': 'Name is required'
    }),
    goalHint: Joi.string().max(1000).optional().allow('').messages({
      'string.max': 'Goal hint must be at most 1000 characters long'
    }),
    startDate: Joi.date().optional().allow(null).messages({
      'date.base': 'Start date must be a valid date'
    }),
    endDate: Joi.date().optional().allow(null).messages({
      'date.base': 'End date must be a valid date'
    }),
    isActive: Joi.boolean().optional().messages({
      'boolean.base': 'isActive must be a boolean value'
    }),
    days: Joi.array().items(workoutPlanDaySchema).optional().messages({
      'array.base': 'Days must be an array'
    })
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

// Validate workout plan update request
const update = async (req: Request, _res: Response, next: NextFunction) => {
  const correctCondition = Joi.object({
    name: Joi.string().min(2).max(200).optional().messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must be at most 200 characters long'
    }),
    goalHint: Joi.string().max(1000).optional().allow('').messages({
      'string.max': 'Goal hint must be at most 1000 characters long'
    }),
    startDate: Joi.date().optional().allow(null).messages({
      'date.base': 'Start date must be a valid date'
    }),
    endDate: Joi.date().optional().allow(null).messages({
      'date.base': 'End date must be a valid date'
    }),
    isActive: Joi.boolean().optional().messages({
      'boolean.base': 'isActive must be a boolean value'
    }),
    days: Joi.array().items(workoutPlanDaySchema).optional().messages({
      'array.base': 'Days must be an array'
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

// Validate workout plan ID parameter
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

export const workoutPlanValidation = {
  createNew,
  update,
  validateId
}
