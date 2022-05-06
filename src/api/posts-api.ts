import { AxiosResponse } from 'axios'
import { TQuery } from '@/types/api-types'
import { TPostsResponse, TPostResponse, TPost, 
  TPostCreate, TPhotoPostResponse, TPostsTotalResponse } from '@/types/posts-types'
import axios, { axiosUpload } from './extras/get-axios'
import { getTotalCount } from './extras/utils-api'
import { preparePhoto } from '@/code/entities/post'

export async function getPosts(query: TQuery): Promise<TPostsTotalResponse> {
  const res = await axios.get<any, AxiosResponse<TPostsResponse>>
    (`/posts`, {
      params: query
    })

  const info = res.data.info?.map(value => {
    return preparePhoto(value)
  }) || null

  return {
    info: info,
    total: getTotalCount(res.headers)
  }
}

export async function getPost(id: number): Promise<TPostResponse> {
  const res = await axios.get<any, AxiosResponse<TPostResponse>>
    (`/posts/${id}`)
  
  const data = {
    info: res.data.info ? preparePhoto(res.data.info) : null
  }

  return data 
}

export async function deletePost(id: number): Promise<TPostResponse> {
  const res = await axios.delete<any, AxiosResponse<TPostResponse>>
    (`/posts/${id}`)
  
  return res.data
}

export async function cupdatePost(post: TPost): Promise<TPostResponse> {
  let res
  if (post.id > 0) {
    const photoSplit = post.photo?.split('/uploads')
    post.photo = photoSplit ? '/uploads' + photoSplit[1] : null
    res = await axios.put<any, AxiosResponse<TPostResponse>, TPost>
      (`/posts/${post.id}`, post)
  } else {
    post.photo = null
    res = await axios.post<any, AxiosResponse<TPostResponse>, TPostCreate>
      (`/posts`, post)
  }

  return res.data
}

export async function uploadPhotoPost(id: number, photo: File): Promise<TPhotoPostResponse> {
  const formData = new FormData()
  formData.append('photo', photo)

  const res = await axiosUpload.post<any, AxiosResponse<TPhotoPostResponse>, FormData>
    (`/posts/${id}/upload`, formData)

  return res.data
}