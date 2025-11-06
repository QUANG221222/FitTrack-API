import { Request, Response, NextFunction } from 'express'
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE,
  SECRET_KEY_MESSAGE,
  SECRET_KEY_RULE
} from '~/utils/validator'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'

// Validate admin creation request
const createNew = async (req: Request, _res: Response, next: NextFunction) => {
  const correctCondition = Joi.object({
    secretKey: Joi.string()
      .pattern(SECRET_KEY_RULE)
      .message(SECRET_KEY_MESSAGE)
      .required(),
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

// Validate admin email verification request
const verifyEmail = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const correctCondition = Joi.object({
    email: Joi.string()
      .pattern(EMAIL_RULE)
      .message(EMAIL_RULE_MESSAGE)
      .required(),
    token: Joi.string().required()
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

// Validate update admin profile request
const update = async (req: Request, _res: Response, next: NextFunction) => {
  const correctCondition = Joi.object({
    displayName: Joi.string().max(100).optional().messages({
      'string.max': 'Display name must be at most 100 characters long'
    })
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

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

// Validate user update request
const updateUser = async (req: Request, _res: Response, next: NextFunction) => {
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
    }),
    isActive: Joi.boolean().optional()
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const adminValidation = {
  createNew,
  verifyEmail,
  update,
  updateUser,
  validateId
}
