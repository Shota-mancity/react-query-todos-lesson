import React, { VFC, memo } from 'react'
import { useQueryTasks } from '../hooks/useQueryTasks';
import {TaskItemMemo} from './TaskItem';

const TaskList:VFC= () => {
    const {data, status}=useQueryTasks()
    // useQueryがキャッシュの変更(追加・更新・削除)を検知すると自動で再レンダリングされる
    console.log("rendered TaskList")
    if(status==="loading") return <div>{"Loading..."}</div>
    if(status==="error") return <div>{"Error"}</div>

  return (
    <div>
      {
          data?.map(task=>(
              <div key={task.id} >
              <ul>
                  <TaskItemMemo task={task} />
              </ul>
              </div>
          ))
      }
    </div>
  )
}

export const TaskListMemo=memo(TaskList)
