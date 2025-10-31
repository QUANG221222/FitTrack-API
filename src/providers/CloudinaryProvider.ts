import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { cloudinary } from '~/configs/cloudinary'

const createCloudinaryStorage = (folderName: string) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `fittrack/${folderName}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
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
        'image/webp'
      ]
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true)
      } else {
        cb(new Error('Invalid file type. Only JPEG, PNG and WebP are allowed.'))
      }
    }
  })
}

const uploadUser = createUpload('user')
const uploadAdmin = createUpload('admin')
const uploadExercise = createUpload('exercise')

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'fittrack',
//     allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
//     transformation: [
//       { width: 800, height: 800, crop: 'limit' },
//       { quality: 'auto' }
//     ],
//     public_id: (_req: any, file: any) => {
//       const timestamp = Date.now()
//       const originalName = file.originalname.split('.')[0]
//       return `cosmetic_${originalName}_${timestamp}`
//     }
//   } as any
// })

// const upload = multer({
//   storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024
//   },
//   fileFilter: (_req, file, cb) => {
//     const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
//     if (allowedMimes.includes(file.mimetype)) {
//       cb(null, true)
//     } else {
//       cb(new Error('Invalid file type. Only JPEG, PNG and WebP are allowed.'))
//     }
//   }
// })

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
  deleteImage
}
