import { AxiosResponse } from "axios"

export default responseOkInterceptor

function responseOkInterceptor(response: AxiosResponse<TResponse>) { 
  const info: any = response.data

  response.data = {
    info,
    ok: true,
    msgError: '',
    err: null
  }

  return response
}