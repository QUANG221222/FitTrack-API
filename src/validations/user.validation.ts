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

export const userValidation = {
  createNew
}
