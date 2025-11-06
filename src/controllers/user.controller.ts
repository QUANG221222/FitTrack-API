import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import {
  CreateUserRequest,
  CreateUserResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  UpdateUserResponse,
  GetUserResponse
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
    next(error)
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
    next(error)
  }
}

const getProfile = async (
  req: Request,
  res: Response<GetUserResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await userService.getProfile(req)

    res.status(StatusCodes.OK).json({
      message: 'User profile retrieved successfully',
      data: result
    })
  } catch (error: any) {
    next(error)
  }
}

const update = async (
  req: Request,
  res: Response<UpdateUserResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.file) {
      req.body.avatar = req.file.path
      req.body.avatarPublicId = req.file.filename
    }

    const result = await userService.update(req)

    res.status(StatusCodes.OK).json({
      message: 'User updated successfully',
      data: result
    })
  } catch (error: any) {
    next(error)
  }
}

export const userController = {
  createNew,
  verifyEmail,
  getProfile,
  update
}
