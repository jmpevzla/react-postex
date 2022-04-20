import { Route, Router, Switch } from 'wouter'
import RouteAuth from '@/components/RouteAuth'
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
        <Route path="/login" component={SLogin} />
        <Route path="/register" component={SRegister} />
        <RouteAuth path="/" component={SHome} />
        <RouteAuth path="/about" component={SAbout} />
        <Route component={SNotfound} /> 
      </Switch>
    </Router>
  )
}
