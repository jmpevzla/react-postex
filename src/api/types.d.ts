interface TResponse<T = any> {
  info: T | null,
  ok: boolean,
  msgError: string,
  err: Error | null
}