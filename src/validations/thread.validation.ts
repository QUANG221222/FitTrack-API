import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import Joi from 'joi'

const createNew = async (req: Request, _res: Response, next: NextFunction) => {
  const correctCondition = Joi.object({
    title: Joi.string().min(2).max(200).required().messages({
      'string.min': 'Title must be at least 2 characters long',
      'string.max': 'Title must be at most 200 characters long',
      'any.required': 'Title is required'
    }),
    type: Joi.string()
      .valid('general', 'nutrition', 'workout', 'lifestyle', 'other')
      .required()
      .messages({
        'any.only':
          'Type must be one of: general, nutrition, workout, lifestyle, other',
        'any.required': 'Type is required'
      }),
    message: Joi.string().min(10).required().messages({
      'string.min': 'Message must be at least 10 characters long',
      'any.required': 'Message is required'
    })
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const threadValidation = {
  createNew
}
