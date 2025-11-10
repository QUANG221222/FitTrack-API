import { Request, Response, NextFunction } from 'express'
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE
} from '~/utils/validator'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'

// Validate user creation request
const createNew = async (req: Request, _res: Response, next: NextFunction) => {
  const correctCondition = Joi.object({
    email: Joi.string()
      .pattern(EMAIL_RULE)
      .message(EMAIL_RULE_MESSAGE)
      .required(),
    password: Joi.string()
      .pattern(PASSWORD_RULE)
      .message(PASSWORD_RULE_MESSAGE)
      .required()
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

// Validate user update request
const update = async (req: Request, _res: Response, next: NextFunction) => {
  const correctCondition = Joi.object({
    displayName: Joi.string().min(3).max(100).optional().messages({
      'string.min': 'Display name must be at least 3 characters long',
      'string.max': 'Display name must be at most 100 characters long'
    }),
    gender: Joi.string().valid('male', 'female', 'other').optional(),
    dob: Joi.date().optional().max('now').messages({
      'date.max': 'Date of birth cannot be in the future'
    }),
    heightCm: Joi.number().min(50).max(300).optional().messages({
      'number.min': 'Height must be at least 50 cm',
      'number.max': 'Height must be at most 300 cm'
    }),
    weightKg: Joi.number().min(20).max(500).optional().messages({
      'number.min': 'Weight must be at least 20 kg',
      'number.max': 'Weight must be at most 500 kg'
    })
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const userValidation = {
  createNew,
  update
}
