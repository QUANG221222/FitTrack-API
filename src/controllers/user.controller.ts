import { Request, Response, NextFunction } from 'express'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import {
  CreateUserRequest,
  CreateUserResponse,
  VerifyEmailRequest,
  VerifyEmailResponse
} from '~/types/user.type'
import { userService } from '~/services/user.service'

const createNew = async (
  req: Request<{}, {}, CreateUserRequest, {}>,
  res: Response<CreateUserResponse>,
  next: NextFunction
) => {
  try {
    const createUser = await userService.createNew(req)

    res.status(StatusCodes.CREATED).send({
      message: 'User created successfully',
      data: createUser
    })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

const verifyEmail = async (
  req: Request<{}, {}, VerifyEmailRequest, {}>,
  res: Response<VerifyEmailResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await userService.verifyEmail(req)
    res.status(StatusCodes.OK).json({
      message: 'Email verified successfully',
      data: result
    })
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
  }
}

export const userController = {
  createNew,
  verifyEmail
}
