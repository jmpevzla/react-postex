
export default responseErrorInterceptor

function responseErrorInterceptor(error: any) {
  const status: number = error.response?.status || 0
  let msg = ''
  switch(status) {
    case 400:
      msg = 'Oops, Bad Request!' 
      break
    case 401:
      msg = 'Oops, You are Unauthorizated!'
      break
    case 500:
      msg = 'Sorry! Server Error!, please try again later'
      break
    default:
      msg = error.message
  }

  error.status = status
  error.message = msg
  throw error
}