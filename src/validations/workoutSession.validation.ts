import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validator'

// Validate workout session set
const workoutSessionSetSchema = Joi.object({
  setNo: Joi.number().min(1).required().messages({
    'number.min': 'Set number must be at least 1',
    'any.required': 'Set number is required'
  }),
  reps: Joi.number().min(0).required().messages({
    'number.min': 'Reps cannot be negative',
    'any.required': 'Reps is required'
  }),
  weight: Joi.number().min(0).required().messages({
    'number.min': 'Weight cannot be negative',
    'any.required': 'Weight is required'
  }),
  rpe: Joi.number().min(0).max(10).optional().messages({
    'number.min': 'RPE cannot be negative',
    'number.max': 'RPE cannot exceed 10'
  }),
  distanceM: Joi.number().min(0).optional().messages({
    'number.min': 'Distance cannot be negative'
  }),
  durationSec: Joi.number().min(0).optional().messages({
    'number.min': 'Duration cannot be negative'
  }),
  isWarmup: Joi.boolean().optional()
})

// Validate workout session exercise
const workoutSessionExerciseSchema = Joi.object({
  exerciseId: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .required(),
  order: Joi.number().min(0).optional().messages({
    'number.min': 'Order cannot be negative'
  }),
  note: Joi.string().max(500).optional().allow('').messages({
    'string.max': 'Note must be at most 500 characters long'
  }),
  sets: Joi.array().items(workoutSessionSetSchema).default([])
})

// Validate workout session creation request
const createNew = async (req: Request, _res: Response, next: NextFunction) => {
  const correctCondition = Joi.object({
    planId: Joi.string()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
      .optional()
      .allow(null),
    startTime: Joi.date().required().messages({
      'date.base': 'Start time must be a valid date',
      'any.required': 'Start time is required'
    }),
    endTime: Joi.date().required().messages({
      'date.base': 'End time must be a valid date',
      'any.required': 'End time is required'
    }),
    mood: Joi.string().max(100).optional().allow('').messages({
      'string.max': 'Mood must be at most 100 characters long'
    }),
    energyLevel: Joi.number().min(1).max(10).optional().messages({
      'number.min': 'Energy level must be at least 1',
      'number.max': 'Energy level cannot exceed 10'
    }),
    note: Joi.string().max(1000).optional().allow('').messages({
      'string.max': 'Note must be at most 1000 characters long'
    }),
    exercises: Joi.array()
      .items(workoutSessionExerciseSchema)
      .optional()
      .messages({
        'array.base': 'Exercises must be an array'
      })
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

// Validate workout session update request
const update = async (req: Request, _res: Response, next: NextFunction) => {
  const correctCondition = Joi.object({
    planId: Joi.string()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
      .optional()
      .allow(null),
    startTime: Joi.date().optional().messages({
      'date.base': 'Start time must be a valid date'
    }),
    endTime: Joi.date().optional().messages({
      'date.base': 'End time must be a valid date'
    }),
    mood: Joi.string().max(100).optional().allow('').messages({
      'string.max': 'Mood must be at most 100 characters long'
    }),
    energyLevel: Joi.number().min(1).max(10).optional().messages({
      'number.min': 'Energy level must be at least 1',
      'number.max': 'Energy level cannot exceed 10'
    }),
    note: Joi.string().max(1000).optional().allow('').messages({
      'string.max': 'Note must be at most 1000 characters long'
    }),
    exercises: Joi.array()
      .items(workoutSessionExerciseSchema)
      .optional()
      .messages({
        'array.base': 'Exercises must be an array'
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

// Validate workout session ID parameter
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

export const workoutSessionValidation = {
  createNew,
  update,
  validateId
}
