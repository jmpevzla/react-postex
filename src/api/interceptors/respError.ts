
export default responseErrorInterceptor

function responseErrorInterceptor(error: any) {
  const res: TResponse = {
    info: null,
    ok: false,
    msgError: error.message,
    err: error
  }
  
  return {
    data: res
  }
}