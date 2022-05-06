import React, { VFC, memo, FormEvent } from 'react'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { selectTag, setEditedTag } from '../slices/todoSlice'
import { useMutateTag } from '../hooks/useMutateTag'

const TagEdit: VFC = () => {
  const editedTag = useAppSelector(selectTag)
  const dispatch = useAppDispatch()
  const { createTagMutation, updateTagMutation } = useMutateTag()

  // cacheの新規作成・更新
  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (editedTag.id === 0) {
      createTagMutation.mutate(editedTag)
    } else {
      updateTagMutation.mutate(editedTag)
    }
  }

  console.log('rendered TagEdit')

  if (createTagMutation.isLoading) {
    return <span>Creating...</span>
  }
  if (updateTagMutation.isLoading) {
    return <span>Updating...</span>
  }

  return (
    <div>
      <form onSubmit={submitHandler}>
        <input
          className="mb-3 px-3 py-2 border border-gray-300"
          placeholder="new tag ?"
          type="text"
          value={editedTag.name}
          onChange={e => {
            //   reduxのstateの新規作成・更新
            dispatch(setEditedTag({ ...editedTag, name: e.target.value }))
          }}
        />
        <button
          className="disabled:opacity-40 m-3 py-2 px-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded"
          disabled={!editedTag.name}
        >
          {editedTag.id === 0 ? 'Create' : 'Update'}
        </button>
      </form>
    </div>
  )
}

export const TagEditMemo = memo(TagEdit)
