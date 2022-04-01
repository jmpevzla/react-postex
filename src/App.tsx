import { useEffect } from "react"
import { useQueryClient } from "react-query"
import { useLogin, useRegister } from "@/hooks/rq/auth-hrq"

export default App

function App() {
  const queryClient = useQueryClient()
  const mutate = useLogin(queryClient)
  
  useEffect(() => {
    async function init() {
      // const res = await login({
      //   email: 'joseperez@postex.io',
      //   password: 'admin1234'
      // })
      // console.log(res)
      //try {
        mutate.mutate({
          email: 'joseperezart@postex.com',
          password: 'alpha1234'
        }, {
          onSuccess(res) {
            console.log(res)
          }
        })
        
      //   console.log('resp: ', resp)
      // } catch(err) {
      //   console.log({...err as any})
      // }
      
    }
    init()
  }, [])
  
  return (
    <>
      <h1>Hello!</h1>
      {mutate.isError && <p>{(mutate.error as any).message}</p>}
    </>
  )
}
