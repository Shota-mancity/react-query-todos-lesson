import React, { VFC, FormEvent, memo } from 'react'
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { selectTask, setEditedTask } from '../slices/todoSlice';
import { useQueryTags } from '../hooks/useQueryTags';
import { useMutateTask } from '../hooks/useMutateTask';

const TaskEdit:VFC= () => {
    const editedTask=useAppSelector(selectTask)
    // useAppSelector:redux内のeditedTaskというstateを読みに行く(引数はselectTask)
    // selectTask:reduxから取得したeditedTaskのstateを返す関数
    const dispatch=useAppDispatch()
    const {data, status}=useQueryTags()
    // useQueryでRESTAPIからタグの一覧を取得
    const {createTaskMutation, updateTaskMutation}=useMutateTask()

    const submitHandler=(e: FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        // ボタン押し下げ時のページリロードを防ぐ
        if(editedTask.id===0) {
            createTaskMutation.mutate(editedTask)
        // 作成モード：編集中のタスクがない(初期値の　id=0に一致)ため、createTaskが実行
        // 新しく作るタスクのオブジェクト(id, title, tag)は、reduxのstate内のeditedTaskにある
        }else {
            updateTaskMutation.mutate(editedTask)
            // 編集モード：編集中のタスクはreduxのeditedTaskにある
        }
    }

    const tagOptions=data?.map(tag=>(
        <option key={tag.id} value={tag.id} >
            {tag.name}
        </option>
    ))

    console.log("rendered TaskEdit")

    // useQueryのstatus
    if(status==="loading") return <div>{"Loading..."}</div>
    if(status==="error") return <div>{"Error"}</div>
    // useMutationのstatus
    if(createTaskMutation.isLoading){
        return <span>Updating...</span>
    }
    if(updateTaskMutation.isLoading){
        return <span>Creating...</span>
    }

  return (
    <div>
      <form onSubmit={submitHandler} >
          <input 
          className="mb-3 py-2 border border-gray-300" 
          placeholder="new task ?" 
          type="text"
          onChange={e=>dispatch(setEditedTask({...editedTask, title: e.target.value}))}
        //   title以外は展開してそのまま
          value={editedTask.title}
          />
      <button 
      className="disabled:opacity-40 my-3 mx-3 py-2 px-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded"
      disabled={!editedTask.title || !editedTask.tag}
      >
          {editedTask.id===0 ? "Create" : "Update"}
      </button>
      </form>
      <select 
      className="mb-3 px-3 py-2 border boder-gray-300"
      value={editedTask.tag}
      onChange={e=>dispatch(setEditedTask({...editedTask, tag: Number(e.target.value)}))}
      >
        <option value={0}>Tag</option>
        {tagOptions}
      </select>
    </div>
  )
}

export const TaskEditMemo=memo(TaskEdit)
