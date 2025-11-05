import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validator'

// Validate exercise creation request
const createNew = async (req: Request, _res: Response, next: NextFunction) => {
  const correctCondition = Joi.object({
    name: Joi.string().min(2).max(200).required().messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must be at most 200 characters long',
      'any.required': 'Name is required'
    }),
    description: Joi.string().max(1000).optional().allow('').messages({
      'string.max': 'Description must be at most 1000 characters long'
    }),
    type: Joi.string()
      .valid('strength', 'cardio','calisthenics', 'mobility', 'flexibility')
      .required()
      .messages({
        'any.only':
          'Type must be one of: strength, cardio, calisthenics, mobility, flexibility',
        'any.required': 'Type is required'
      }),
    difficulty: Joi.string()
      .valid('beginner', 'intermediate', 'advance')
      .optional()
      .messages({
        'any.only': 'Difficulty must be one of: beginner, intermediate, advance'
      }),
    equipment: Joi.string().max(200).optional().allow('').messages({
      'string.max': 'Equipment must be at most 200 characters long'
    }),
    mediaVideoUrl: Joi.string().uri().optional().allow('').messages({
      'string.uri': 'Media video URL must be a valid URL'
    }),
    primaryMuscles: Joi.array()
      .items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
      )
      .min(1)
      .required()
      .messages({
        'array.min': 'At least one primary muscle group is required',
        'any.required': 'Primary muscles are required'
      }),
    secondaryMuscles: Joi.array()
      .items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
      )
      .optional()
      .messages({
        'array.base': 'Secondary muscles must be an array'
      }),
    isPublic: Joi.boolean().optional().messages({
      'boolean.base': 'isPublic must be a boolean value'
    })
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

// Validate exercise update request
const update = async (req: Request, _res: Response, next: NextFunction) => {
  const correctCondition = Joi.object({
    name: Joi.string().min(2).max(200).optional().messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must be at most 200 characters long'
    }),
    description: Joi.string().max(1000).optional().allow('').messages({
      'string.max': 'Description must be at most 1000 characters long'
    }),
    type: Joi.string()
      .valid('strength', 'cardio', 'mobility', 'flexibility')
      .optional()
      .messages({
        'any.only':
          'Type must be one of: strength, cardio, mobility, flexibility'
      }),
    difficulty: Joi.string()
      .valid('beginner', 'intermediate', 'advance')
      .optional()
      .messages({
        'any.only': 'Difficulty must be one of: beginner, intermediate, advance'
      }),
    equipment: Joi.string().max(200).optional().allow('').messages({
      'string.max': 'Equipment must be at most 200 characters long'
    }),
    mediaVideoUrl: Joi.string().uri().optional().allow('').messages({
      'string.uri': 'Media video URL must be a valid URL'
    }),
    primaryMuscles: Joi.array()
      .items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
      )
      .min(1)
      .optional()
      .messages({
        'array.min': 'At least one primary muscle group is required'
      }),
    secondaryMuscles: Joi.array()
      .items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
      )
      .optional()
      .messages({
        'array.base': 'Secondary muscles must be an array'
      }),
    isPublic: Joi.boolean().optional().messages({
      'boolean.base': 'isPublic must be a boolean value'
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

// Validate exercise ID parameter
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

export const exerciseValidation = {
  createNew,
  update,
  validateId
}
