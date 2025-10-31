import { Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { muscleGroupModel } from '~/models/muscleGroup.model'
import ApiError from '~/utils/ApiError'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'
import { pickMuscleGroup } from '~/utils/fomatter'

const createNew = async (req: Request): Promise<any> => {
  try {
    const { name, description } = req.body

    // Check if muscle group already exists
    const existingMuscleGroup = await muscleGroupModel.findOneByName(name)
    if (existingMuscleGroup) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        'Muscle group with this name already exists'
      )
    }

    // Prepare muscle group data
    const muscleGroupData: any = {
      name,
      description: description || ''
    }

    // Handle image upload if file is provided
    if (req.file) {
      muscleGroupData.imageUrl = req.file.path
      muscleGroupData.imagePublicId = req.file.filename
    }

    const createdMuscleGroup = await muscleGroupModel.createNew(muscleGroupData)

    const newMuscleGroup = await muscleGroupModel.findOneById(
      createdMuscleGroup.insertedId.toString()
    )

    return pickMuscleGroup(newMuscleGroup)
  } catch (error) {
    throw error
  }
}

const getAll = async (): Promise<any> => {
  try {
    const muscleGroups = await muscleGroupModel.findAll()
    return muscleGroups.map((muscleGroup) => pickMuscleGroup(muscleGroup))
  } catch (error) {
    throw error
  }
}

const getOneById = async (id: string): Promise<any> => {
  try {
    const muscleGroup = await muscleGroupModel.findOneById(id)

    if (!muscleGroup) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Muscle group not found')
    }

    return pickMuscleGroup(muscleGroup)
  } catch (error) {
    throw error
  }
}

const update = async (req: Request): Promise<any> => {
  try {
    const { id } = req.params

    // Find muscle group
    const muscleGroup = await muscleGroupModel.findOneById(id)
    if (!muscleGroup) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Muscle group not found')
    }

    // Check if name is being updated and if it conflicts with existing
    if (req.body.name && req.body.name !== muscleGroup.name) {
      const existingMuscleGroup = await muscleGroupModel.findOneByName(
        req.body.name
      )
      if (existingMuscleGroup) {
        throw new ApiError(
          StatusCodes.CONFLICT,
          'Muscle group with this name already exists'
        )
      }
    }

    // Handle image upload if file is provided
    if (req.file) {
      // Delete old image from Cloudinary if exists
      if (muscleGroup.imagePublicId) {
        await CloudinaryProvider.deleteImage(muscleGroup.imagePublicId)
      }

      req.body.imageUrl = req.file.path
      req.body.imagePublicId = req.file.filename
    }

    // Prepare update data
    const updateData = {
      ...req.body,
      updatedAt: Date.now()
    }

    // Update muscle group in database
    const updatedMuscleGroup = await muscleGroupModel.update(id, updateData)

    if (!updatedMuscleGroup) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to update muscle group'
      )
    }

    return pickMuscleGroup(updatedMuscleGroup)
  } catch (error) {
    throw error
  }
}

const deleteOne = async (id: string): Promise<any> => {
  try {
    // Find muscle group to get image info
    const muscleGroup = await muscleGroupModel.findOneById(id)
    if (!muscleGroup) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Muscle group not found')
    }

    // Delete image from Cloudinary if exists
    if (muscleGroup.imagePublicId) {
      await CloudinaryProvider.deleteImage(muscleGroup.imagePublicId)
    }

    // Delete muscle group from database
    const deleted = await muscleGroupModel.deleteOne(id)

    if (!deleted) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to delete muscle group'
      )
    }

    return { deleted: true }
  } catch (error) {
    throw error
  }
}

export const muscleGroupService = {
  createNew,
  getAll,
  getOneById,
  update,
  deleteOne
}
