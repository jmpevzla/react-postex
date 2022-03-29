import Axios from 'axios'
import reqAuthInterceptor from './interceptors/reqAuth'
import reqUploadInterceptor from './interceptors/reqUpload'
import responseErrorInterceptor from './interceptors/respError'
import responseOkInterceptor from './interceptors/respOk'

const axios = Axios.create()
axios.interceptors.request.use(reqAuthInterceptor)
axios.interceptors.response.use(responseOkInterceptor, responseErrorInterceptor)
export default axios

export const axiosAuth = Axios.create()
axiosAuth.interceptors.response.use(responseOkInterceptor, responseErrorInterceptor)

export const axiosUpload = Axios.create()
axiosUpload.interceptors.request.use(reqAuthInterceptor)
axiosUpload.interceptors.request.use(reqUploadInterceptor)
axiosUpload.interceptors.response.use(responseOkInterceptor, responseErrorInterceptor)
