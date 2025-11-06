import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validator'

// Validate progress photo creation request
const createNew = async (req: Request, _res: Response, next: NextFunction) => {
  const correctCondition = Joi.object({
    takenAt: Joi.date().optional().messages({
      'date.base': 'Taken at must be a valid date'
    }),
    view: Joi.string().valid('front', 'side', 'back').required().messages({
      'any.only': 'View must be one of: front, side, back',
      'any.required': 'View is required'
    }),
    note: Joi.string().max(500).optional().allow('').messages({
      'string.max': 'Note must be at most 500 characters long'
    }),
    blurhash: Joi.string().optional().allow('').messages({
      'string.base': 'Blurhash must be a string'
    })
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

// Validate progress photo update request
const update = async (req: Request, _res: Response, next: NextFunction) => {
  const correctCondition = Joi.object({
    takenAt: Joi.date().optional().messages({
      'date.base': 'Taken at must be a valid date'
    }),
    view: Joi.string().valid('front', 'side', 'back').optional().messages({
      'any.only': 'View must be one of: front, side, back'
    }),
    note: Joi.string().max(500).optional().allow('').messages({
      'string.max': 'Note must be at most 500 characters long'
    }),
    blurhash: Joi.string().optional().allow('').messages({
      'string.base': 'Blurhash must be a string'
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

// Validate progress photo ID parameter
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

export const progressPhotoValidation = {
  createNew,
  update,
  validateId
}
