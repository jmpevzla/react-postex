import { Route, Router, Switch } from 'wouter'
import SLogin from "@/suspensePages/SLogin"
import SRegister from "@/suspensePages/SRegister"
import SHome from "@/suspensePages/SHome"
import SNotfound from "@/suspensePages/SNotfound"

export default App

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={SLogin} />
        <Route path="/register" component={SRegister} />
        <Route path="/" component={SHome} />
        <Route component={SNotfound} /> 
      </Switch>
    </Router>
  )
}
