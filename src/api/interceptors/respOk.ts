import type { TResponse } from "@/types/api-types"
import type { AxiosResponse } from "axios"

export default responseOkInterceptor

function responseOkInterceptor(response: AxiosResponse<TResponse>) { 
  const info: any = response.data

  response.data = {
    info
  }

  return response
}