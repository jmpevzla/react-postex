import { Route, RouteProps } from 'wouter'
import axios from 'axios'
import Page401 from '../errors/Page401'
import { useEffect, useMemo, useState } from 'react'
import PageLoading from '../errors/PageLoading'

function RouteAuth(props: RouteProps) {
  const token = useMemo(() => window.localStorage.getItem('postex-token'), [])
  const [auth, setAuth] = useState('')

  useEffect(() => {
    async function init() {
      try {
        
        await axios.get('/check', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setAuth('logged')
        
      } catch(err: any) {
        console.error(err)
        window.localStorage.removeItem('postex-token')
        setAuth('unauthorizated')
      }
    }
    init()
  }, [])

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