import { pick } from 'lodash'

export const pickUser = (user: any): any => {
  return pick(user, [
    '_id',
    'email',
    'username',
    'displayName',
    'role',
    'isActive',
    'heightCm',
    'weightKg',
    'dob',
    'gender',
    'avatar',
    'avatarPublicId',
    'createdAt',
    'updatedAt'
  ])
}

export const pickAdmin = (user: any): any => {
  return pick(user, [
    '_id',
    'email',
    'username',
    'displayName',
    'role',
    'avatar',
    'avatarPublicId',
    'isActive',
    'createdAt',
    'updatedAt'
  ])
}

export const pickMuscleGroup = (muscleGroup: any): any => {
  return pick(muscleGroup, [
    '_id',
    'name',
    'description',
    'imageUrl',
    'imagePublicId',
    'createdAt',
    'updatedAt'
  ])
}
