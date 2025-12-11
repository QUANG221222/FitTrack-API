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

const getTotalUsersByMonth = async (): Promise<{ month: string; users: number }[]> => {
  try {
    const res =  await userModel.countUsersByMonth()
    const months = [ { id: '01', month: 'Jan' }, { id: '02', month: 'Feb' }, { id: '03', month: 'Mar' }, { id: '04', month: 'Apr' }, { id: '05', month: 'May' }, { id: '06', month: 'Jun' }, { id: '07', month: 'Jul' }, { id: '08', month: 'Aug' }, { id: '09', month: 'Sep' }, { id: '10', month: 'Oct' }, { id: '11', month: 'Nov' }, { id: '12', month: 'Dec' } ]
    
    res.map(item => {
      const monthName = months.find(m => m.id === item.month)
      if (monthName) {
        item.month = monthName.month
      }
    })

    return res
  } catch (error) {
    throw error
  }
}

const getTotalExercisesByType = async (): Promise<any[]> => {
  try {
    const res =  await exerciseModel.countExercisesByType()
    const types = [
      { name: 'strength', color: '#FF5733' },
      { name: 'cardio', color: '#33FF57' },
      { name: 'mobility', color: '#3357FF' },
      { name: 'flexibility', color: '#FF33A8' },
      { name: 'calisthenics', color: '#FFA500' }
    ]

    for (const type of types) {
      const exists = res.find(item => item.name === type.name)
      if (!exists) {
        res.push({ name: type.name, value: 0 })
      }
    }
    
    const result = res.map(item => {
      const typeInfo = types.find(t => t.name === item.name)
      if (typeInfo) {
        return { ...item, color: typeInfo.color }
      }
      return item
    })

    return result as any[]
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
  getTotalWorkoutPlans,
  getTotalUsersByMonth,
  getTotalExercisesByType
}
