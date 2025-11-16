import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { cloudinary } from '~/configs/cloudinary'

const createCloudinaryStorage = (
  folderName: string,
  isVideo: boolean = false
) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `fittrack/${folderName}`,
      resource_type: isVideo ? 'video' : 'image',
      allowed_formats: isVideo
        ? ['mp4', 'mov', 'avi', 'wmv', 'flv', 'webm']
        : ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      transformation: isVideo
        ? []
        : [{ width: 800, height: 800, crop: 'limit' }, { quality: 'auto' }],
      public_id: (_req: any, file: any) => {
        const timestamp = Date.now()
        const originalName = file.originalname.split('.')[0]
        return `${folderName}_${originalName}_${timestamp}`
      }
    } as any
  })
}

const createUpload = (folderName: string, isVideo: boolean = false) => {
  return multer({
    storage: createCloudinaryStorage(folderName, isVideo),
    limits: {
      fileSize: isVideo ? 100 * 1024 * 1024 : 5 * 1024 * 1024 // 100MB for video, 5MB for image
    },
    fileFilter: (_req, file, cb) => {
      if (isVideo) {
        const allowedMimes = [
          'video/mp4',
          'video/quicktime',
          'video/x-msvideo',
          'video/x-ms-wmv',
          'video/x-flv',
          'video/webm'
        ]
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true)
        } else {
          cb(
            new Error(
              'Invalid file type. Only MP4, MOV, AVI, WMV, FLV and WebM are allowed.'
            )
          )
        }
      } else {
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
    }
  })
}

const uploadUser = createUpload('user')
const uploadProgressPhoto = createUpload('progress-photos')
const uploadAdmin = createUpload('admin')
const uploadExercise = createUpload('exercise')
const uploadExerciseVideo = createUpload('exercise-videos', true)
const uploadMuscleGroup = createUpload('muscle-groups')
const uploadBlogThumbnail = createUpload('blog-thumbnails')

const deleteMedia = async (
  publicId: string,
  resourceType: 'image' | 'video' = 'image'
): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
  } catch (error) {
    throw new Error(`Failed to delete ${resourceType} from Cloudinary`)
  }
}

// Backward compatibility
const deleteImage = async (publicId: string): Promise<void> => {
  return deleteMedia(publicId, 'image')
}

const deleteVideo = async (publicId: string): Promise<void> => {
  return deleteMedia(publicId, 'video')
}

export const CloudinaryProvider = {
  uploadUser,
  uploadAdmin,
  uploadExercise,
  uploadExerciseVideo,
  uploadMuscleGroup,
  uploadProgressPhoto,
  uploadBlogThumbnail,
  deleteImage,
  deleteVideo,
  deleteMedia
}
