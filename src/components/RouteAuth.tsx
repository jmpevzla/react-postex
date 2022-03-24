import { Route, RouteProps } from 'wouter'
import axios from 'axios'
import Page401 from '../errors/Page401'
import { useEffect, useMemo, useState } from 'react'
import PageLoading from '../errors/PageLoading'
import { useContext } from 'react'
import { setUserAction, userContext } from '@/ContextUser'
import { useRef } from 'react'

function RouteAuth(props: RouteProps) {
  const token = useMemo(() => window.localStorage.getItem('postex-token'), [])
  const [auth, setAuth] = useState('')
  const refPath = useRef('')
  const [, userDispatch] = useContext(userContext)!

  useEffect(() => {
    if (refPath.current != props.path) {
      refPath.current = props.path!
      
      async function init() {
        try {
          const userId = window.localStorage.getItem('postex-user-id')
          
          // await axios.get('/check', {
          //   headers: {
          //     Authorization: `Bearer ${token}`
          //   }
          // })
  
          const user = await axios.get(`/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
  
          userDispatch({
            type: setUserAction,
            payload: user.data
          })
  
          setAuth('logged')
          
        } catch(err: any) {
          console.error(err)
          window.localStorage.removeItem('postex-token')
          window.localStorage.removeItem('postex-user-id')
          setAuth('unauthorizated')
        }
      }
      init()
    }
  })

  switch(auth) {
    case 'logged': 
      return (<Route {...props} />)  
    case 'unauthorizated':
      return (<Route path={props.path} component={Page401} />)
    default :
      return (<Route path={props.path} component={PageLoading} />)
  }
}

export default RouteAuth