import type { TResponse } from "./api-types"

interface TCredentials {
  email: string,
  password: string
}

interface TUser {
  id: number,
  name: string,
  email: string
}

type TUserResponse = TResponse<TUser>
interface TAuthData {
  message: string,
  token: string,
  user: TUser
}
type TAuthResponse = TResponse<TAuthData>

interface TSignUp {
  name: string,
  email: string,
  password: string,
  confPassword: string
}
