import axios from "axios";
import { Tag } from "../types/types";
import { useQuery } from "react-query";

export const useQueryTags=()=>{
    const getTags=async()=>{
        const {data}=await axios.get<Tag[]>(`${process.env.REACT_APP_REST_URL}/tags/`)
        return data
    }

    return useQuery<Tag[], Error>({
        queryKey: "tags",
        queryFn: getTags,
        staleTime: 60000,
        // リアルタイムである必要がない
    })
}