import type { TResponse, TTotalResponse } from "./api-types"

interface TPost {
  id: number,
  title: string,
  author: string,
  photo: string
}
type TPostCreate = Omit<TPost, 'id'>
type TPosts = TPost[]

type TPostResponse = TResponse<TPost>
type TPostsResponse = TResponse<TPosts>
type TPostsTotalResponse = TTotalResponse<TPosts>

interface TPostsInf {
  data: TPosts,
  nextPage: number | null
}

interface TPhotoPost {
  id: number,
  photo: string
}
type TPhotoPostResponse = TResponse<TPhotoPost>

interface TPhotoPostMutation {
  id: number,
  photo: File
}