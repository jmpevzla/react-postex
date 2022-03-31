import { AxiosResponse } from 'axios'
import omit from 'lodash/omit'
import { TQuery } from '@/types/api-types'
import { TPostsResponse, TPostResponse, TPost, 
  TPostCreate, TPhotoPostResponse, TPostsTotalResponse } from '@/types/posts-types'
import axios, { axiosUpload } from './extras/get-axios'
import { getTotalCount } from './extras/utils-api'

export async function getPosts(query: TQuery): Promise<TPostsTotalResponse> {
  const res = await axios.get<any, AxiosResponse<TPostsResponse>>
    (`/posts`, {
      params: query
    })
  
  return {
    info: res.data.info,
    total: getTotalCount(res.headers)
  }
}

export async function getPost(id: number): Promise<TPostResponse> {
  const res = await axios.get<any, AxiosResponse<TPostResponse>>
    (`/posts/${id}`)
  
  return res.data
}

export async function deletePost(id: number): Promise<TPostResponse> {
  const res = await axios.delete<any, AxiosResponse<TPostResponse>>
    (`/posts/${id}`)
  
  return res.data
}

export async function cupdatePost(post: TPost): Promise<TPostResponse> {
  let res
  if (post.id > 0) {
    res = await axios.put<any, AxiosResponse<TPostResponse>, TPost>
      (`/posts/${post.id}`, post)
  } else {
    res = await axios.post<any, AxiosResponse<TPostResponse>, TPostCreate>
      (`/posts`, omit(post, 'id'))
  }

  return res.data
}

export async function uploadPhotoPost(id: number, photo: File): Promise<TPhotoPostResponse> {
  const formData = new FormData()
  formData.append('photo', photo)

  const res = await axiosUpload.post<any, AxiosResponse<TPhotoPostResponse>, FormData>
    (`/posts/upload/${id}`, formData)

  return res.data
}