import { exerciseModel } from '~/models/exercise.model'
import { userModel } from '~/models/user.model'
import { muscleGroupModel } from '~/models/muscleGroup.model'
import { workoutPlanModel } from '~/models/workoutPlan.model'

const getTotalExercises = async (): Promise<number> => {
  try {
    return await exerciseModel.countExercises()
  } catch (error) {
    throw error
  }
}

const getTotalUsers = async (): Promise<number> => {
  try {
    return await userModel.countUsers()
  } catch (error) {
    throw error
  }
}

const getTotalMuscleGroups = async (): Promise<number> => {
  try {
    return await muscleGroupModel.countMuscleGroups()
  } catch (error) {
    throw error
  }
}

const getTotalWorkoutPlans = async (): Promise<number> => {
  try {
    return await workoutPlanModel.countWorkoutPlans()
  } catch (error) {
    throw error
  }
}

export const dashboardService = {
  getTotalExercises,
  getTotalUsers,
  getTotalMuscleGroups,
  getTotalWorkoutPlans
}
