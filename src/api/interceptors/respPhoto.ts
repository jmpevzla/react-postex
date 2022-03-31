import type { AxiosResponse } from "axios"
import { TPhotoPostResponse, TPhotoPost } from "@/types/posts-types"

export default responsePhotoInterceptor

function responsePhotoInterceptor(response: AxiosResponse<TPhotoPostResponse>) { 
  const photoPost: TPhotoPost | null = response.data.info

  if (photoPost && photoPost.photo) {
    response.data.info = {
      ...photoPost,
      photo: `${response.config.baseURL}/${photoPost.photo}`
    }
  }
  
  return response
}