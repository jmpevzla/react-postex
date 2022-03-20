import axios from 'axios'
import { omit } from 'lodash'

// axios.defaults.headers.common = {
//   'no-auth': 1
// }

axios.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('postex-token')

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`
    }
  }

  return config
})

axios.defaults.baseURL = 'http://localhost:4000'

export async function getPosts(query: Record<string, string | number>) {
  try {
    const res = await axios.get('/posts', {
        params: query
      }
    )

    return res
  } catch(err) {
    console.error(err)   
  }
}

export async function getPost(id: number) {
  try {
    const res = await axios.get(`/posts/${id}`)
    return res
  } catch (err) {
    console.error(err)
  }
}

export async function deletePost(id: number) {
  try {
    const res = await axios.delete(`/posts/${id}`)
    return res
  } catch (err) {
    console.error(err)
  }
}

export async function cupdatePost(post: TPost) {
  try {
    let res
    if (post.id > 0) {
      res = await axios.put(`/posts/${post.id}`, post)
    } else {
      res = await axios.post(`/posts`, omit(post, 'id'))      
    }

    return res
  } catch (err) {
    console.error(err)
  }
}

export async function logout() {
  try {
    const res = await axios.get(`/logout`)
    
    return {ok: true, error: ''}
  } catch (err: any) {
    console.error(err)
    return {ok: false, error: err.message}
  }
}

export async function upload(id: number, file: File) {
  try {
    const formData = new FormData()
    formData.append('photo', file)
    const res = await axios.post(`/posts/upload/${id}`, formData, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    })
    
    return {ok: true, error: ''}
  } catch (err: any) {
    console.error(err)
    return {ok: false, error: err.message}
  }
}