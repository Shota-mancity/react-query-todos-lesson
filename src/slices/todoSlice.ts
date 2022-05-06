// redux-tool-kit(RTKit)のstateを定義
// featuresのcounterSlice.tsをコピペで使用し、featuresフォルダは削除
// export先の相対パスを変更

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../app/store'
import { EditTask, Tag } from '../types/types'

export interface TaskState {
  editedTask: EditTask
  editedTag: Tag
}

const initialState: TaskState = {
  editedTask: {
    id: 0,
    title: '',
    tag: 0
  },
  editedTag: {
    id: 0,
    name: ''
  }
}

export const taskSlice = createSlice({
  name: 'task',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setEditedTask: (state, action: PayloadAction<EditTask>) => {
      // payloadとして、引数として変更したいTaskのオブジェクトの型を指定
      state.editedTask = action.payload
      // 受け取ったオブジェクトにpayloadでアクセスし、reduxのstate内のeditedTaskに格納する
    },
    // editedTaskのstateの中身を更新するアクション
    // react内でdispatchでsetEditedTaskというアクションを呼び出すと、変更したいタスクの内容を引数で渡し、redux内のeditedTaskに格納される
    resetEditedTask: state => {
      // editedTaskを初期値にリセットするためのアクション
      state.editedTask = initialState.editedTask
    },
    setEditedTag: (state, action: PayloadAction<Tag>) => {
      state.editedTag = action.payload
    },
    resetEditedTag: state => {
      state.editedTag = initialState.editedTag
    }
  }
})

export const {
  setEditedTask,
  resetEditedTask,
  setEditedTag,
  resetEditedTag
} = taskSlice.actions
// taskSliceのreducerの4つのアクションをコンポーネント内で呼べるようexport

export const selectTask = (state: RootState) => state.task.editedTask
export const selectTag = (state: RootState) => state.task.editedTag
// redux内のeditedTaskとeditedTagのstateを返す関数

export default taskSlice.reducer
