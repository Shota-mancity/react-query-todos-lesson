// タスクを新規作成・更新・削除
import axios from 'axios'
import { useAppDispatch } from '../app/hooks'
// reduxのアクションを呼びだし
import { resetEditedTask } from '../slices/todoSlice'
// todoSliceの中から使いたいアクションをimport
import { useQueryClient, useMutation } from 'react-query'
import { EditTask, Task } from '../types/types'

// データ更新時には既存のキャッシュを自分で書き換え
export const useMutateTask = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  // 既存のキャッシュを取得するためにクライアントを作成

  //   useMutation: React Queryでデータを登録・編集・削除したりする
  const createTaskMutation = useMutation(
    // taskを新規作成するためにmutationを作成
    (task: Omit<EditTask, 'id'>) =>
      // useMutation実行時に引数の受け取りが可能
      // 新しくタグを作成するので、新しいタスクのタイトルや番号を引数で受け取り
      // データの型(task)はEditTaskからidを抜いたもの(taskの新規作成時はidをpostで渡す必要がないため)
      axios.post<Task>(`${process.env.REACT_APP_REST_URL}/tasks/`, task),
    // エンドポイントのオブジェクトに新しいtaskを渡す
    {
      // 既存のキャッシュの配列の内容に新しく作成したtaskを追加する
      onSuccess: res => {
        // 既存の処理が成功した時の後処理を記載
        // resにはpostメソッドで作成した新しいtaskが入ってくる
        const previousTodos = queryClient.getQueryData<Task[]>('tasks')
        // 既存のキャッシュの内容(taskの一覧)を取得
        // 実際に取得するデータはkey(tasks)で与える
        if (previousTodos) {
          //既存のキャッシュが存在するなら、その内容を書き換え
          queryClient.setQueryData<Task[]>('tasks', [
            // キャッシュを書き換える時はsetQueryDataを用い、keyを指定してデータの取得先を指定
            // 新しい配列でキャッシュの内容を上書き
            ...previousTodos,
            res.data
          ])
        }
        dispatch(resetEditedTask())
      }
    }
  )

  const updateTaskMutation = useMutation(
    // update用のmutation
    (task: EditTask) =>
      // 更新したい新しいtaskを引数で受け取り
      axios.put<Task>(
        `${process.env.REACT_APP_REST_URL}/tasks/${task.id}/`,
        task
      ),
    // putメソッドでREST.APIを使って更新のアクセスを実行
    {
      // 更新成功時は、マニュアルでキャッシュの内容を更新
      onSuccess: (res, variables) => {
        // res:更新後のtaskのオブジェクトが返ってくる
        // variables:エンドポイントアクセス時に渡したデータ(task)が入ってくる
        const previousTodos = queryClient.getQueryData<Task[]>('tasks')
        // 既存のキャッシュの内容をgetQueryDataで取得
        if (previousTodos) {
          queryClient.setQueryData<Task[]>(
            // データが存在するならば、setQueryDataでキャッシュの内容を更新
            'tasks',
            previousTodos.map(
              taskInCache =>
                taskInCache.id === variables.id ? res.data : taskInCache
              // 更新したtaskのみをキャッシュの中で書き換える
              // taskをいったん展開し、更新したtaskのidと一致するもののみ書き換え
            )
          )
        }
        dispatch(resetEditedTask())
      }
    }
  )

  const deleteTaskMutation = useMutation(
    (id: number) =>
      axios.delete(`${process.env.REACT_APP_REST_URL}/tasks/${id}/`),
    {
      // 削除成功時も自分でキャッシュの内容を書き換え
      onSuccess: (res, variables) => {
        // variables:エンドポイントアクセス時に渡したデータ(id)が入ってくる
        const previousTodos = queryClient.getQueryData<Task[]>('tasks')
        if (previousTodos) {
          queryClient.setQueryData<Task[]>(
            'tasks',
            previousTodos.filter(taskInCache => taskInCache.id !== variables)
          )
        }
        dispatch(resetEditedTask())
      }
    }
  )

  return { createTaskMutation, updateTaskMutation, deleteTaskMutation }
  //   カスタムフックの返り値としてMutationの関数を返し、Reactコンポーネントから呼び出せるようにする
}
