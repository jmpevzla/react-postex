import { useEffect } from "react"
import { login } from "./api/auth"

export default App

function App() {
  useEffect(() => {
    async function init() {
      const res = await login({
        email: 'joseperez@postex.io',
        password: 'admin123'
      })
      console.log(res)
    }
    init()
  }, [])
  
  return (
    <h1>Hello!</h1>
  )
}
