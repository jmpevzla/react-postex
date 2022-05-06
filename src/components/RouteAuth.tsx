import { useContext, useEffect, useState } from "react"
import { Route, RouteProps, useLocation } from "wouter"
import { setUserAction, userContext } from "@/contexts/userContext"
import SUnauthorizated from "@/suspensePages/SUnauthorizated"
import Loading from "@/pages/Loading"
import { getStUserId
  , clearStUser } from "@/extras/storage-extras"
import { useUser } from "@/hooks/rq/auth-hrq"
import SPageError from "@/suspensePages/SPageError"

export default RouteAuth

const LOGGED = 'logged'
const UNAUTHORIZATED = 'unauthorizated'
const ERROR = 'error'

function RouteAuth(props: RouteProps) {
  const userId = getStUserId()
  const [user, userDispatch] = useContext(userContext)!
  const [auth, setAuth] = useState('')
  const [, setLocation] = useLocation()
  const userApi = useUser(Number(userId))

  function hasUser() {
    return user !== null
  }

  function isError401() {
    return userApi.isError && userApi.error.status === 401
  }

  function isError() {
    return userApi.isError
  }

  function hasUserData() {
    return !userApi.isError && userApi.isSuccess && user === null
  }

  function noUserData() {
    return !userApi.isError && !userApi.isLoading && user === null
  }

  useEffect(() => {

    if (hasUser()) {
      return setAuth(LOGGED)
    }

    if (isError401()) {
      clearStUser()
      if (props.path === '/') {
        return setLocation('/login')
      }
      return setAuth(UNAUTHORIZATED)
    }

    if (isError()) {
      return setAuth(ERROR)
    }

    if (hasUserData()) {
      userDispatch({
        type: setUserAction,
        payload: userApi.data
      })
      userApi.remove()
      return setAuth(LOGGED)
    }

    if (noUserData()) {
      userApi.refetch()
    }
    
  })

  switch(auth) {
    case LOGGED:
      return <Route {...props} />
    case UNAUTHORIZATED:
      return <Route path={props.path} component={SUnauthorizated} />
    case ERROR:
      return (
        <Route path={props.path}>
          <SPageError error={userApi.error?.message!} />
        </Route>
      )
    default:
      return <Route path={props.path} component={Loading} />
  }
}