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

export const pickExercise = (exercise: any): any => {
  return pick(exercise, [
    '_id',
    'adminId',
    'name',
    'description',
    'type',
    'difficulty',
    'equipment',
    'mediaVideoUrl',
    'mediaImageUrl',
    'mediaImagePublicId',
    'primaryMuscles',
    'secondaryMuscles',
    'isPublic',
    'createdAt',
    'updatedAt'
  ])
}

export const pickWorkoutPlan = (workoutPlan: any): any => {
  return pick(workoutPlan, [
    '_id',
    'userId',
    'name',
    'goalHint',
    'startDate',
    'endDate',
    'isActive',
    'days',
    'createdAt',
    'updatedAt'
  ])
}

export const pickWorkoutSession = (workoutSession: any): any => {
  return pick(workoutSession, [
    '_id',
    'userId',
    'planId',
    'startTime',
    'endTime',
    'mood',
    'energyLevel',
    'note',
    'exercises',
    'createdAt',
    'updatedAt'
  ])
}
