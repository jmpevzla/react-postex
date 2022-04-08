interface TUserContext {
  id: number,
  name: string,
  email: string
}

interface TAction<T> {
  type: string,
  payload?: T
}

type TUserReducer = [
  TUserContext | null,
  React.Dispatch<TAction<TUserContext>>
] | null
