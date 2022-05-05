import { useEffect, useState } from "react";
import { setSessionEntity } from "@/extras/storage-extras";
import { TPost, TUsePostId } from "@/types/posts-types";

export default useLoadPost

function useLoadPost(idPost: number, setPostQuery: TUsePostId):
[TPost | null, boolean] {

  const [loading, setLoading] = useState(true)
  const [post, setPost] = useState<TPost|null>(null)

  useEffect(() => {

    function onSuccess(data: TPost) {
      setSessionEntity('post', data)
      setPost(data)
    }

    function isLoading(value: boolean) {
      setLoading(value)
    }

    setPostQuery({
      id: idPost,
      onSuccess,
      isLoading
    })

  }, [])  
 
  return [post, loading]

}