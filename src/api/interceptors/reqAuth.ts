import { AxiosRequestConfig } from "axios"

export default reqAuthInterceptor

function reqAuthInterceptor(config: AxiosRequestConfig) {
  const token = window.localStorage.getItem('postex-token')

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`
    }
  }

  return config
}