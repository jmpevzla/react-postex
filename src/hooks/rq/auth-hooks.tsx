import { login, logout, register } from "@/api/auth";
import { QueryClient, useMutation } from "react-query";
import { onSuccessFunc } from "./helpers-hrq";

export function useLogin(queryClient: QueryClient) {
  return useMutation((credentials: TCredentials) => {
    return login(credentials)  
  }, {
    onSuccess: onSuccessFunc(queryClient)
  })
}

export function useRegister(queryClient: QueryClient) {
  return useMutation((signUp: TSignUp) => {
    return register(signUp)  
  }, {
    onSuccess: onSuccessFunc(queryClient)
  })
}

export function useLogout(queryClient: QueryClient) {
  return useMutation(() => {
    return logout()  
  }, {
    onSuccess: onSuccessFunc(queryClient)
  })
}