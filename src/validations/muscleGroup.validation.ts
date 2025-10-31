import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validator'

// Validate muscle group creation request
const createNew = async (req: Request, _res: Response, next: NextFunction) => {
  const correctCondition = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must be at most 100 characters long',
      'any.required': 'Name is required'
    }),
    description: Joi.string().max(500).optional().allow('').messages({
      'string.max': 'Description must be at most 500 characters long'
    })
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

// Validate muscle group update request
const update = async (req: Request, _res: Response, next: NextFunction) => {
  const correctCondition = Joi.object({
    name: Joi.string().min(2).max(100).optional().messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must be at most 100 characters long'
    }),
    description: Joi.string().max(500).optional().allow('').messages({
      'string.max': 'Description must be at most 500 characters long'
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

// Validate muscle group ID parameter
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

export const muscleGroupValidation = {
  createNew,
  update,
  validateId
}
