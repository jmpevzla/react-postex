import type { TResponse, TTotalResponse } from "./api-types"

interface TPost {
  id: number,
  title: string,
  author: string,
  photo: string | null
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

type TCupdatePostFunc = (values: TPost, photoFile: File | null,
  dispatchConfirmEvent: (value: boolean) => void, 
  setError: React.Dispatch<React.SetStateAction<string>>) => void

type TUpdatePhotoFunc = (id: number, photoFile: File,
  setPhoto: (photo: string) => void, 
  setError: React.Dispatch<React.SetStateAction<string>>) => void

type TCreatePostPhotoFunc = (photoFile: File,
  setPhoto: (photo: string) => void, 
  setError: React.Dispatch<React.SetStateAction<string>>) => void

type TUsePostId = React.Dispatch<React.SetStateAction<{
  id: number;
  onSuccess: (data: TPost) => void;
  isLoading: (value: boolean) => void;
}>>