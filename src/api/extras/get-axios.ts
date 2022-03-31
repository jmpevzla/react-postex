import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import reqAuthInterceptor from '../interceptors/reqAuth'
import reqUploadInterceptor from '../interceptors/reqUpload'
import responseErrorInterceptor from '../interceptors/respError'
import responseOkInterceptor from '../interceptors/respOk'
import responsePhotoInterceptor from '../interceptors/respPhoto'

function addRequest(axiosInstance: AxiosInstance, 
  onFulfilled?: (config: AxiosRequestConfig) => AxiosRequestConfig, 
  onRejected?: (error: any) => any) {

  axiosInstance.interceptors.request.use(onFulfilled, onRejected)  
}

function addResponse(axiosInstance: AxiosInstance, 
  onFulfilled?: (response: AxiosResponse) => AxiosResponse, 
  onRejected?: (error: any) => any) {

  axiosInstance.interceptors.response.use(onFulfilled, onRejected)  
}

const axios = Axios.create()
addRequest(axios, reqAuthInterceptor)
addResponse(axios, responseOkInterceptor, responseErrorInterceptor)

export default axios

export const axiosAuth = Axios.create()
addResponse(axiosAuth, responseOkInterceptor, responseErrorInterceptor)

export const axiosUpload = Axios.create()
addRequest(axiosUpload, reqAuthInterceptor)
addRequest(axiosUpload, reqUploadInterceptor)
addResponse(axiosUpload, responseOkInterceptor, responseErrorInterceptor)
addResponse(axiosUpload, responsePhotoInterceptor)
