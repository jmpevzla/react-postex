import { TPost, TUsePostId } from "@/types/posts-types"
import PostPhotoShow from "./PostPhotoShow"
import { useEffect, useState } from "react"
import LoadingComp from "./LoadingComp"
import { setSessionEntity } from "@/extras/storage-extras"

export default Post

function Post({ idPost, setPostQuery }: 
  { idPost: number, 
    setPostQuery: TUsePostId
  }) {
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
  
  if (loading) {
    return <LoadingComp />
  } 

  if (post) {
    return (
      <div>
        <div className="
            grid gap-2 grid-rows-[1fr_275px]
            overflow-y-auto max-h-[calc(100vh_-_15rem)]
            md:overflow-y-hidden md:max-h-auto
            md:grid-rows-none md:grid-cols-[1fr_210px]
          ">
        
          <div className="text-left px-1 md:max-h-[calc(100vh_-_15rem)] md:overflow-y-auto">
            <div className="mb-3">
              <p className="font-bold text-xs select-none">ID</p>
              <p className="border-2 rounded-lg text-xl p-2">{ post.id }</p>
            </div>
            
            <div className="mb-3">
              <p className="font-bold text-xs select-none">Title</p>
              <p className="border-2 rounded-lg text-xl p-2">{ post.title }</p>
            </div>

            <div className="mb-3">
              <p className="font-bold text-xs select-none">Author</p>
              <p className="border-2 rounded-lg text-xl p-2">{ post.author }</p>
            </div>
      
          </div>
          <div className="mb-3 flex items-center">
            <div className="border-4 rounded-lg p-1 md:border-1 mx-auto">
              <PostPhotoShow photo={post.photo} title={post.title} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}