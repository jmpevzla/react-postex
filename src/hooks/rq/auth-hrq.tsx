import { QueryClient, useMutation, useQuery } from "react-query";
import { checkEmail, getUser, login
  , logout, register } from "@/api/auth-api";
import type { TError, TCheckData } from "@/types/api-types";
import type { TAuthData, TCredentials
  , TSignUp, TUser } from "@/types/auth-types";
import { onSuccessFunc } from "./extras/helpers-hrq";

export function useLogin(queryClient: QueryClient) {
  return useMutation<TAuthData, TError, TCredentials>
    (async (credentials) => {
      const { info } = await login(credentials) 
      return info!
  }, {
    onSuccess: onSuccessFunc(queryClient)
  })
}

export function useRegister(queryClient: QueryClient) {
  return useMutation<TAuthData, TError, TSignUp>
    (async (signUp) => {
      const { info } = await register(signUp)
      return info!
  }, {
    onSuccess: onSuccessFunc(queryClient)
  })
}

export function useCheckEmail(email: string) {
  return useQuery<TCheckData, TError>
    (['check-email', email], async () => {
      const { info } = await checkEmail(email)
      return info!
  }, {
    enabled: false
  })
}

export function useLogout(queryClient: QueryClient) {
  return useMutation<void, TError>
    (async () => {
      await logout()
  }, {
    onSuccess: onSuccessFunc(queryClient)
  })
}

export function useUser(id: number) {
  return useQuery<TUser, TError>
    (['user', id], async () => {
      const { info } = await getUser(id)
      return info!
  }, {
    enabled: false
  })
}