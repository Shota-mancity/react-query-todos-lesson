import React, { VFC, memo } from 'react'
import { useQueryTags } from '../hooks/useQueryTags';
import { TagItemMemo } from './TagItem';
import { useQueryClient } from 'react-query';
import { Tag } from '../types/types';

const TagList:VFC= () => {
    // useQueryを使ってサーバーからデータを取得してコンポーネントに表示
    // useQuery: キャッシュの変更を検知して自動で再レンダリング
    const {status, data}=useQueryTags()

    if(status==="loading") return <div>{"Loading..."}</div>
    if(status==="error") return <div>{"Error"}</div>

    // getQueryDataを使ってキャッシュからデータを取得してコンポーネントに表示
    // getQueryData: キャッシュの変更を検知しないため、変更のタイミングで自動で再レンダリングされない
    // const queryClient=useQueryClient()
    // const data=queryClient.getQueryData<Tag[]>("tags")

    console.log("rendered TagList")


  return (
    <div>
      {
          data?.map(tag=>(
              <div key={tag.id} >
                  <ul>
                    <TagItemMemo tag={tag} />
                  </ul>
              </div>
          ))
      }
    </div>
  )
}

export const TagListMemo=memo(TagList) 
