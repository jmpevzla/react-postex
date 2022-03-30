import { QueryClient, useMutation } from "react-query";
import { login, logout, register } from "@/api/auth";
import type { TError, TResponse } from "@/types/api-types";
import type { TAuthResponse, TCredentials, TSignUp } from "@/types/auth-types";
import { onSuccessFunc } from "./helpers-hrq";

export function useLogin(queryClient: QueryClient) {
  return useMutation<TAuthResponse, TError, TCredentials>
    ((credentials) => {
      return login(credentials)  
  }, {
    onSuccess: onSuccessFunc(queryClient)
  })
}

export function useRegister(queryClient: QueryClient) {
  return useMutation<TAuthResponse, TError, TSignUp>
    ((signUp) => {
      return register(signUp)  
  }, {
    onSuccess: onSuccessFunc(queryClient)
  })
}

export function useLogout(queryClient: QueryClient) {
  return useMutation<TResponse, TError, never>
    (() => {
      return logout()
  }, {
    onSuccess: onSuccessFunc(queryClient)
  })
}