import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { CreateThreadRequest, CreateThreadResponse } from '~/types/thread.type'
import { threadService } from '~/services/thread.service'

const createNew = async (
  req: Request<{}, {}, CreateThreadRequest, {}>,
  res: Response<CreateThreadResponse>,
  next: NextFunction
) => {
  try {
    const result = await threadService.createNewThread(req)

    res.status(StatusCodes.CREATED).json({
      message: 'Thread created successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const getAllThreads = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const threads = await threadService.getAllThreads()
    res.status(StatusCodes.OK).json({
      message: 'Threads fetched successfully',
      data: threads
    })
  } catch (error) {
    next(error)
  }
}

const deleteThread = async (
  req: Request<{ threadId: string }, {}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { threadId } = req.params
    await threadService.deleteThread(threadId)
    res.status(StatusCodes.OK).json({
      message: 'Thread deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

export const threadController = { createNew, deleteThread, getAllThreads }
