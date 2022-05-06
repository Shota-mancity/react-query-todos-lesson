import { useAppDispatch } from '../app/hooks'
import { useQueryClient, useMutation } from 'react-query'
import axios from 'axios'
import { Tag } from '../types/types'
import { resetEditedTag } from '../slices/todoSlice'

export const useMutateTag = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  const createTagMutation = useMutation(
    (tag: Omit<Tag, 'id'>) =>
      axios.post<Tag>(`${process.env.REACT_APP_REST_URL}/tags/`, tag),
    {
      onSuccess: res => {
        const previousTags = queryClient.getQueryData<Tag[]>('tags')
        if (previousTags) {
          queryClient.setQueryData<Tag[]>('tags', [...previousTags, res.data])
        }
        dispatch(resetEditedTag())
      }
    }
  )

  const updateTagMutation = useMutation(
    (tag: Tag) =>
      axios.put<Tag>(`${process.env.REACT_APP_REST_URL}/tags/${tag.id}/`, tag),
    {
      onSuccess: (res, variables) => {
        const previousTags = queryClient.getQueryData<Tag[]>('tags')
        // 既存のキャッシュを取得
        if (previousTags) {
          queryClient.setQueryData<Tag[]>(
            'tags',
            previousTags.map(
              tagInCache =>
                tagInCache.id === variables.id ? res.data : tagInCache
              // 更新したtagの部分だけを書き換え
            )
          )
        }
        dispatch(resetEditedTag())
      }
    }
  )

  const deleteTagMutation = useMutation(
    (id: number) =>
      axios.delete(`${process.env.REACT_APP_REST_URL}/tags/${id}/`),
    {
      onSuccess: (res, variables) => {
        const previousTags = queryClient.getQueryData<Tag[]>('tags')
        if (previousTags) {
          queryClient.setQueryData(
            'tags',
            previousTags.filter(tagInCache => tagInCache.id !== variables)
          )
        }
        dispatch(resetEditedTag)
      }
    }
  )

  return { createTagMutation, updateTagMutation, deleteTagMutation }
}
