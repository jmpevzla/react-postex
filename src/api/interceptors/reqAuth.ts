import { getStToken } from "@/extras/storage-extras"
import type { AxiosRequestConfig } from "axios"

export default reqAuthInterceptor

function reqAuthInterceptor(config: AxiosRequestConfig) {
  const token = getStToken()

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`
    }
  }

  return config
}