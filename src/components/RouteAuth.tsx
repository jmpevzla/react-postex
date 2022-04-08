import { useContext, useEffect, useState } from "react"
import { Route, RouteProps } from "wouter"
import { isEqual } from "lodash"
import { clearUserAction, setUserAction, userContext } from "@/contexts/userContext"
import SUnauthorizated from "@/suspensePages/SUnauthorizated"
import Loading from "@/pages/Loading"
import { getStUserId
  , clearStUser, stOkLogin } from "@/extras/storage-extras"
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
      setAuth(LOGGED)
      return
    }

    if (isError401()) {
      setAuth(UNAUTHORIZATED)
      return
    }

    if (isError()) {
      setAuth(ERROR)
      return
    }

    if (hasUserData()) {
      userDispatch({
        type: setUserAction,
        payload: userApi.data
      })
      userApi.remove()
      setAuth(LOGGED)
      return
    }

    if (noUserData()) {
      userApi.refetch()
    }
    
  })

  //console.log('USER::', user, userApi)

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