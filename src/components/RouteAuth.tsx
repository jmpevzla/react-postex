import { Route, RouteProps } from 'wouter'
import Page401 from '../errors/Page401'

function RouteAuth(props: RouteProps) {
  const isAuth = false

  if (isAuth) {
    return (<Route {...props} />)
  }

  return (<Route path={props.path} component={Page401} />)
}

export default RouteAuth