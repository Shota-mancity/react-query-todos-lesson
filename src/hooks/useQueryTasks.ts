import axios from 'axios'
import { useQuery } from 'react-query'
import { Task } from '../types/types'

export const useQueryTasks = () => {
  const getTasks = async () => {
    const { data } = await axios.get<Task[]>(
      `${process.env.REACT_APP_REST_URL}/tasks/`
    )
    return data
  }

  return useQuery<Task[], Error>({
    queryKey: 'tasks',
    queryFn: getTasks,
    staleTime: 0,
    // tasksのエンドポイントのデータはリアルタイムでユーザーが取得可能
    refetchOnWindowFocus: true
    // refetchInterval: 5000
  })
  //   カスタムフックの返り値としてuseQueryの実行結果を返す
}
