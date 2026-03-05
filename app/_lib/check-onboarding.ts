import dayjs from 'dayjs'
import { getHomeData, getUserTrainData } from './api/fetch-generated'

export async function needsOnboarding(): Promise<boolean> {
  const [homeResponse, trainDataResponse] = await Promise.all([
    getHomeData(dayjs().format('YYYY-MM-DD')),
    getUserTrainData(),
  ])

  if (trainDataResponse.status === 200 && trainDataResponse.data === null) {
    return true
  }

  if (homeResponse.status === 200 && !homeResponse.data.activeWorkoutPlanId) {
    return true
  }

  return false
}
