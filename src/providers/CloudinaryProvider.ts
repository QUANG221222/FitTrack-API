import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { cloudinary } from '~/configs/cloudinary'

const createCloudinaryStorage = (folderName: string) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `fittrack/${folderName}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto' }
      ],
      public_id: (_req: any, file: any) => {
        const timestamp = Date.now()
        const originalName = file.originalname.split('.')[0]
        return `${folderName}_${originalName}_${timestamp}`
      }
    } as any
  })
}

const createUpload = (folderName: string) => {
  return multer({
    storage: createCloudinaryStorage(folderName),
    limits: {
      fileSize: 5 * 1024 * 1024
    },
    fileFilter: (_req, file, cb) => {
      const allowedMimes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/gif'
      ]
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true)
      } else {
        cb(
          new Error(
            'Invalid file type. Only JPEG, PNG, WebP and GIF are allowed.'
          )
        )
      }
    }
  })
}

const uploadUser = createUpload('user')
const uploadProgressPhoto = createUpload('progress-photos')
const uploadAdmin = createUpload('admin')
const uploadExercise = createUpload('exercise')
const uploadMuscleGroup = createUpload('muscle-groups')

const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    throw new Error('Failed to delete image from Cloudinary')
  }
}

export const CloudinaryProvider = {
  uploadUser,
  uploadAdmin,
  uploadExercise,
  uploadMuscleGroup,
  uploadProgressPhoto,
  deleteImage
}
