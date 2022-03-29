import { AxiosResponse } from 'axios'
import axios, { axiosAuth } from './get-axios'

export async function login(data: any): Promise<TResponse> {
  const res = await axiosAuth.post<any, AxiosResponse<TResponse>>(`/login`, data)
  return res.data
}

export async function register(data: any): Promise<TResponse> {
  const res = await axiosAuth.post<any, AxiosResponse<TResponse>>(`/register`, data)
  return res.data
}

export async function logout() {
  const res = await axios.get<any, AxiosResponse<TResponse>>(`/logout`)
  return res.data
}
