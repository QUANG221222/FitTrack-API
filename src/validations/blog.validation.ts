import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validator'

// Validate blog creation request
const createNew = async (req: Request, _res: Response, next: NextFunction) => {
  const correctCondition = Joi.object({
    name: Joi.string().min(2).max(200).required().messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must be at most 200 characters long',
      'any.required': 'Name is required'
    }),
    type: Joi.string()
      .valid('general', 'nutrition', 'workout', 'lifestyle', 'other')
      .required()
      .messages({
        'any.only':
          'Type must be one of general, nutrition, workout, lifestyle, or other',
        'any.required': 'Type is required'
      }),
    description: Joi.string().max(1000).optional().allow('').messages({
      'string.max': 'Description must be at most 1000 characters long'
    }),
    content: Joi.string().optional().allow('').messages({
      'string.base': 'Content must be a string'
    })
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

// Validate blog update request
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
      .valid('general', 'nutrition', 'workout', 'lifestyle', 'other')
      .optional()
      .messages({
        'any.only':
          'Type must be one of general, nutrition, workout, lifestyle, or other'
      }),
    content: Joi.string().optional().allow('').messages({
      'string.base': 'Content must be a string'
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

// Validate blog ID parameter
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

export const blogValidation = {
  createNew,
  update,
  validateId
}
