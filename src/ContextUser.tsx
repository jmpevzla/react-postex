import { isEqual } from "lodash";
import { createContext, ReactElement, useReducer } from "react";

export interface TUserContext {
  id: number,
  name: string
  email: string,
}

interface TAction<T> {
  type: string,
  payload?: T
}

type TUserReducer = [TUserContext | null, React.Dispatch<TAction<TUserContext>>] | null

export const userContext = createContext<TUserReducer>(null)

export const setUserAction = 'SETUSER'
export const clearUserAction = 'CLEARUSER'

export function UserProvider({ children }: { children: ReactElement }) {
  const { Provider } = userContext

  const [user, dispatch] = useReducer(
    (state: TUserContext | null, action: TAction<TUserContext>) => {
      switch(action.type) {
        case setUserAction:
          if (isEqual(state, action.payload!)) {
            return state
          } 
          return {...action.payload!}
        case clearUserAction:
          return null
        default:
          return state
      }
  }, null)

  return (
    <Provider value={[user, dispatch]}>
      { children }
    </Provider>
  )
}