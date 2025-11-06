import { Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { progressPhotoModel } from '~/models/progressPhoto.model'
import { userModel } from '~/models/user.model'
import ApiError from '~/utils/ApiError'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'
import { pickProgressPhoto } from '~/utils/fomatter'

const createNew = async (req: Request): Promise<any> => {
  try {
    const { takenAt, view, note, blurhash } = req.body

    // Get userId from JWT token
    const userId = req.jwtDecoded.id

    // Check if user exists
    const user = await userModel.findOneById(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    // Check if image file is provided
    if (!req.file) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Image file is required')
    }

    // Prepare progress photo data
    const progressPhotoData: any = {
      userId,
      takenAt: takenAt ? new Date(takenAt) : new Date(),
      view,
      imageUrl: req.file.path,
      imagePublicId: req.file.filename,
      note: note || '',
      blurhash: blurhash || ''
    }

    const createdProgressPhoto = await progressPhotoModel.createNew(
      progressPhotoData
    )

    const newProgressPhoto = await progressPhotoModel.findOneById(
      createdProgressPhoto.insertedId.toString()
    )

    return pickProgressPhoto(newProgressPhoto)
  } catch (error) {
    // If there's an error and file was uploaded, delete it from Cloudinary
    if (req.file && req.file.filename) {
      await CloudinaryProvider.deleteImage(req.file.filename)
    }
    throw error
  }
}

const getAll = async (req: Request): Promise<any> => {
  try {
    const { view, startDate, endDate } = req.query

    // Get userId from JWT token
    const userId = req.jwtDecoded.id

    const filters: any = { userId }

    if (view) filters.view = view
    if (startDate) filters.startDate = startDate
    if (endDate) filters.endDate = endDate

    const progressPhotos = await progressPhotoModel.findAll(filters)
    return progressPhotos.map((photo) => pickProgressPhoto(photo))
  } catch (error) {
    throw error
  }
}

const getOneById = async (req: Request): Promise<any> => {
  try {
    const { id } = req.params
    const userId = req.jwtDecoded.id

    const progressPhoto = await progressPhotoModel.findOneById(id)

    if (!progressPhoto) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Progress photo not found')
    }

    // Check if user owns this progress photo
    if (progressPhoto.userId.toString() !== userId.toString()) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        'You are not authorized to view this progress photo'
      )
    }

    return pickProgressPhoto(progressPhoto)
  } catch (error) {
    throw error
  }
}

const update = async (req: Request): Promise<any> => {
  try {
    const { id } = req.params
    const userId = req.jwtDecoded.id

    // Find progress photo
    const progressPhoto = await progressPhotoModel.findOneById(id)
    if (!progressPhoto) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Progress photo not found')
    }

    // Check if user owns this progress photo
    if (progressPhoto.userId.toString() !== userId.toString()) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        'You are not authorized to update this progress photo'
      )
    }

    // Handle image upload if file is provided
    if (req.file) {
      // Delete old image from Cloudinary if exists
      if (progressPhoto.imagePublicId) {
        await CloudinaryProvider.deleteImage(progressPhoto.imagePublicId)
      }

      req.body.imageUrl = req.file.path
      req.body.imagePublicId = req.file.filename
    }

    // Prepare update data
    const updateData = {
      ...req.body,
      updatedAt: Date.now()
    }

    // Convert takenAt to Date if provided
    if (updateData.takenAt) {
      updateData.takenAt = new Date(updateData.takenAt)
    }

    // Update progress photo in database
    const updatedProgressPhoto = await progressPhotoModel.update(id, updateData)

    if (!updatedProgressPhoto) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to update progress photo'
      )
    }

    return pickProgressPhoto(updatedProgressPhoto)
  } catch (error) {
    // If there's an error and new file was uploaded, delete it from Cloudinary
    if (req.file && req.file.filename) {
      await CloudinaryProvider.deleteImage(req.file.filename)
    }
    throw error
  }
}

const deleteOne = async (req: Request): Promise<any> => {
  try {
    const { id } = req.params
    const userId = req.jwtDecoded.id

    // Find progress photo to check ownership and get image info
    const progressPhoto = await progressPhotoModel.findOneById(id)
    if (!progressPhoto) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Progress photo not found')
    }

    // Check if user owns this progress photo
    if (progressPhoto.userId.toString() !== userId.toString()) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        'You are not authorized to delete this progress photo'
      )
    }

    // Delete image from Cloudinary if exists
    if (progressPhoto.imagePublicId) {
      await CloudinaryProvider.deleteImage(progressPhoto.imagePublicId)
    }

    // Delete progress photo from database
    const deleted = await progressPhotoModel.deleteOne(id)

    if (!deleted) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to delete progress photo'
      )
    }

    return { deleted: true }
  } catch (error) {
    throw error
  }
}

export const progressPhotoService = {
  createNew,
  getAll,
  getOneById,
  update,
  deleteOne
}
