import { createContext, ReactElement, useReducer } from 'react'

export const userContext = createContext<TUserReducer>(null)
export const setUserAction = 'SETUSER'
export const clearUserAction = 'CLEARUSER'
export default UserProvider

function UserProvider({ children }: { children: ReactElement }) {
  const { Provider } = userContext

  const [user, dispatch] = useReducer(
    (state: TUserContext | null, action: TAction<TUserContext>) => {
      switch(action.type) {
        case setUserAction: 
          return action.payload!
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