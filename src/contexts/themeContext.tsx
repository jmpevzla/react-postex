import { createContext, ReactElement, useReducer } from 'react'

export const themeContext = createContext<TThemeReducer>(null)
export const setThemeAction = 'SETTHEMEACTION'

export default ThemeProvider

function ThemeProvider({ children }: { children: ReactElement }) {
  const { Provider } = themeContext

  const [theme, dispatch] = useReducer(
    (state: TThemeContext | null, action: TAction<TThemeContext>) => {
      switch(action.type) {
        case setThemeAction: 
          return action.payload!
        default:
          return state
      }
  }, null) 

  return (
    <Provider value={[theme, dispatch]}>
      { children }
    </Provider>
  )
}