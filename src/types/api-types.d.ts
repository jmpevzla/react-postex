import type { AxiosError } from "axios"

interface TQuery {
  q?: string,
  _sort?: string,
  _order?: string,
  _page?: number,
  _limit?: number,
  [key: string]: string | number | undefined
}

interface TResponse<T = any> {
  info: T | null
}

interface TError extends AxiosError {
  status: number
}

interface TCheckData {
  ok: boolean
}
type TCheckResponse = TResponse<TCheckData>