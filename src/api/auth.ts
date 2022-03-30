import type { AxiosResponse } from 'axios'
import type { TResponse } from '@/types/api-types'
import type { TAuthResponse, TCredentials, TSignUp } from '@/types/auth-types'
import axios, { axiosAuth } from './get-axios'

export async function login(credentials: TCredentials): Promise<TAuthResponse> {
  const res = await axiosAuth.post<any, AxiosResponse<TAuthResponse>, TCredentials>
    (`/login`, credentials)
  
  return res.data
}

export async function register(signUp: TSignUp): Promise<TAuthResponse> {
  const res = await axiosAuth.post<any, AxiosResponse<TAuthResponse>, TSignUp>
    (`/register`, signUp)
  
  return res.data
}

export async function logout() {
  const res = await axios.post<any, AxiosResponse<TResponse>, never>
    (`/logout`)
  
  return res.data
}
