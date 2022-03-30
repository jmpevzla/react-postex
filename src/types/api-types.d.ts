import type { AxiosError } from "axios"

interface TResponse<T = any> {
  info: T | null
}

interface TError extends AxiosError {
  status: number
}