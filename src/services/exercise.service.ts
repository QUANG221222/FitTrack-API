import { Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { exerciseModel } from '~/models/exercise.model'
import { muscleGroupModel } from '~/models/muscleGroup.model'
import ApiError from '~/utils/ApiError'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'
import { pickExercise } from '~/utils/fomatter'

const createNew = async (req: Request): Promise<any> => {
  try {
    const {
      name,
      description,
      type,
      difficulty,
      equipment,
      primaryMuscles,
      secondaryMuscles,
      isPublic
    } = req.body

    // Get adminId from JWT token
    const adminId = req.jwtDecoded.id

    // Check if exercise already exists
    const existingExercise = await exerciseModel.findOneByName(name)
    if (existingExercise) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        'Exercise with this name already exists'
      )
    }

    // Validate primary muscles exist
    if (primaryMuscles && primaryMuscles.length > 0) {
      for (const muscleId of primaryMuscles) {
        const muscle = await muscleGroupModel.findOneById(muscleId)
        if (!muscle) {
          throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Primary muscle group with id ${muscleId} not found`
          )
        }
      }
    }

    // Validate secondary muscles exist
    if (secondaryMuscles && secondaryMuscles.length > 0) {
      for (const muscleId of secondaryMuscles) {
        const muscle = await muscleGroupModel.findOneById(muscleId)
        if (!muscle) {
          throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Secondary muscle group with id ${muscleId} not found`
          )
        }
      }
    }

    // Prepare exercise data
    const exerciseData: any = {
      adminId,
      name,
      description: description || '',
      type,
      difficulty: difficulty || 'beginner',
      equipment: equipment || '',
      primaryMuscles: primaryMuscles || [],
      secondaryMuscles: secondaryMuscles || [],
      isPublic: isPublic !== undefined ? isPublic : true
    }

    // Handle image upload if file is provided
    if (req.file) {
      exerciseData.mediaImageUrl = req.file.path
      exerciseData.mediaImagePublicId = req.file.filename
    }

    const createdExercise = await exerciseModel.createNew(exerciseData)

    const newExercise = await exerciseModel.findOneById(
      createdExercise.insertedId.toString()
    )

    return pickExercise(newExercise)
  } catch (error) {
    throw error
  }
}

const getAll = async (req: Request): Promise<any> => {
  try {
    const { type, difficulty, isPublic, muscleGroupId } = req.query

    const filters: any = {}

    if (type) filters.type = type
    if (difficulty) filters.difficulty = difficulty
    if (isPublic !== undefined) filters.isPublic = isPublic === 'true'
    if (muscleGroupId) filters.muscleGroupId = muscleGroupId

    const exercises = await exerciseModel.findAll(filters)
    return exercises.map((exercise) => pickExercise(exercise))
  } catch (error) {
    throw error
  }
}

const getOneById = async (id: string): Promise<any> => {
  try {
    const exercise = await exerciseModel.findOneById(id)

    if (!exercise) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Exercise not found')
    }

    return pickExercise(exercise)
  } catch (error) {
    throw error
  }
}

const update = async (req: Request): Promise<any> => {
  try {
    const { id } = req.params
    const adminId = req.jwtDecoded.id || req.jwtDecoded._id

    // Find exercise
    const exercise = await exerciseModel.findOneById(id)
    if (!exercise) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Exercise not found')
    }

    // Check if admin is the owner (only owner can update)
    if (exercise.adminId.toString() !== adminId.toString()) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        'You are not authorized to update this exercise'
      )
    }

    // Check if name is being updated and if it conflicts with existing
    if (req.body.name && req.body.name !== exercise.name) {
      const existingExercise = await exerciseModel.findOneByName(req.body.name)
      if (existingExercise) {
        throw new ApiError(
          StatusCodes.CONFLICT,
          'Exercise with this name already exists'
        )
      }
    }

    // Validate primary muscles if provided
    if (req.body.primaryMuscles && req.body.primaryMuscles.length > 0) {
      for (const muscleId of req.body.primaryMuscles) {
        const muscle = await muscleGroupModel.findOneById(muscleId)
        if (!muscle) {
          throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Primary muscle group with id ${muscleId} not found`
          )
        }
      }
    }

    // Validate secondary muscles if provided
    if (req.body.secondaryMuscles && req.body.secondaryMuscles.length > 0) {
      for (const muscleId of req.body.secondaryMuscles) {
        const muscle = await muscleGroupModel.findOneById(muscleId)
        if (!muscle) {
          throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Secondary muscle group with id ${muscleId} not found`
          )
        }
      }
    }

    // Handle image upload if file is provided
    if (req.file) {
      // Delete old image from Cloudinary if exists
      if (exercise.mediaImagePublicId) {
        await CloudinaryProvider.deleteImage(exercise.mediaImagePublicId)
      }

      req.body.mediaImageUrl = req.file.path
      req.body.mediaImagePublicId = req.file.filename
    }

    // Prepare update data
    const updateData = {
      updatedAt: Date.now(),
      ...req.body
    }

    // Update exercise in database
    const updatedExercise = await exerciseModel.update(id, updateData)

    if (!updatedExercise) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to update exercise'
      )
    }

    return pickExercise(updatedExercise)
  } catch (error) {
    throw error
  }
}

const deleteOne = async (req: Request): Promise<any> => {
  try {
    const { id } = req.params
    const adminId = req.jwtDecoded.id || req.jwtDecoded._id

    // Find exercise to get image info and check ownership
    const exercise = await exerciseModel.findOneById(id)
    if (!exercise) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Exercise not found')
    }

    // Check if admin is the owner (only owner can delete)
    if (exercise.adminId.toString() !== adminId.toString()) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        'You are not authorized to delete this exercise'
      )
    }

    // Delete image from Cloudinary if exists
    if (exercise.mediaImagePublicId) {
      await CloudinaryProvider.deleteImage(exercise.mediaImagePublicId)
    }

    // Delete video from Cloudinary if exists
    if (exercise.mediaVideoPublicId) {
      await CloudinaryProvider.deleteVideo(exercise.mediaVideoPublicId)
    }

    // Delete exercise from database
    const deleted = await exerciseModel.deleteOne(id)

    if (!deleted) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to delete exercise'
      )
    }

    return { deleted: true }
  } catch (error) {
    throw error
  }
}

const uploadVideo = async (req: Request): Promise<any> => {
  try {
    const { id } = req.params
    const adminId = req.jwtDecoded.id || req.jwtDecoded._id

    // Find exercise
    const exercise = await exerciseModel.findOneById(id)
    if (!exercise) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Exercise not found')
    }

    // Check if admin is the owner
    if (exercise.adminId.toString() !== adminId.toString()) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        'You are not authorized to upload video for this exercise'
      )
    }

    if (req.file) {
      // Delete old video from Cloudinary if exists
      if (exercise.mediaVideoPublicId) {
        await CloudinaryProvider.deleteVideo(exercise.mediaVideoPublicId)
      }

      // Prepare update data
      req.body.mediaVideoUrl = req.file.path
      req.body.mediaVideoPublicId = req.file.filename
    }

    const updateData = {
      ...req.body,
      updatedAt: Date.now()
    }

    // Update exercise in database
    const updatedExercise = await exerciseModel.update(id, updateData)

    if (!updatedExercise) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to upload video'
      )
    }

    return pickExercise(updatedExercise)
  } catch (error) {
    throw error
  }
}

export const exerciseService = {
  createNew,
  getAll,
  getOneById,
  update,
  deleteOne,
  uploadVideo
}
