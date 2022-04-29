import { Route, Router, Switch } from 'wouter'
import RouteTitle from './components/RouteTitle'
import RouteTitleAuth from './components/RouteTitleAuth'
import SLogin from "@/suspensePages/SLogin"
import SRegister from "@/suspensePages/SRegister"
import SHome from "@/suspensePages/SHome"
import SAbout from "@/suspensePages/SAbout"
import SNotfound from "@/suspensePages/SNotfound"

export default App

function App() {
  return (
    <Router>
      <Switch>
        <RouteTitle path="/login" title="login" component={SLogin} />
        <RouteTitle path="/register" title="register" component={SRegister} />
        <RouteTitleAuth path="/about" title="about" component={SAbout} />
        <RouteTitleAuth path="/" title="home" component={SHome} />
        <Route component={SNotfound} />  
      </Switch>
    </Router>
  )
}
