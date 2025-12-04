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
    'phoneNumber',
    'bio',
    'location',
    'gender',
    'dob',
    'heightCm',
    'weightKg',
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
    'mediaVideoPublicId',
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

export const pickMetricEntry = (metricEntry: any): any => {
  return pick(metricEntry, [
    '_id',
    'userId',
    'metricCode',
    'value',
    'unit',
    'note',
    'measureAt',
    'createdAt',
    'updatedAt'
  ])
}

export const pickGoal = (goal: any): any => {
  return pick(goal, [
    '_id',
    'userId',
    'goalType',
    'targetValue',
    'unit',
    'startValue',
    'startDate',
    'targetDate',
    'status',
    'note',
    'metricCode',
    'exerciseId',
    'createdAt',
    'updatedAt'
  ])
}

export const pickProgressPhoto = (progressPhoto: any): any => {
  return pick(progressPhoto, [
    '_id',
    'userId',
    'takenAt',
    'view',
    'imageUrl',
    'imagePublicId',
    'note',
    'blurhash',
    'createdAt',
    'updatedAt'
  ])
}

export const pickBlog = (blog: any): any => {
  return pick(blog, [
    '_id',
    'adminId',
    'name',
    'description',
    'content',
    'type',
    'thumbnailUrl',
    'thumbnailPublicId',
    'likes',
    'views',
    'createdAt',
    'updatedAt'
  ])
}
