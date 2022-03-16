import axios from 'axios'

axios.defaults.headers.common = {
  'no-auth': 1
}

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