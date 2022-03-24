import { Link, Route, Router, Switch } from 'wouter'
import RouteAuth from './components/RouteAuth'
import Posts from './posts/List'
import Page404 from './errors/Page404'
import Page500 from './errors/Page500'
//import AboutMe from './aboutme/AboutMe'
import SuspendAbout from './aboutme/SuspendAbout'
import Login from './auth/Login'
import Register from './auth/Register'
import React from 'react'

function App() {

  return (
    <div>
      <header>
        <nav>
          <Link href="/login">
            <a className="link">login</a>
          </Link> | 
          <Link href="/register">
            <a className="link">register</a>
          </Link> | 
          <Link href="/">
            <a className="link">posts</a>
          </Link> | 
          <Link href="/about-me">
            <a className="link">About Me</a>
          </Link> |
          <Link href="/401">
            <a className="link">Unauthorized</a>
          </Link> |
          <Link href="/404">
            <a className="link">Not Found</a>
          </Link> |
          <Link href="/500">
            <a className="link">Server Error</a>
          </Link>
        </nav>
      </header>

      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <RouteAuth path="/about-me" component={SuspendAbout} />
          <Route path="/500" component={Page500} />
          <RouteAuth path="/" component={Posts} />
          <Route component={Page404} />
        </Switch>
      </Router>
      
      {/* <Route path="/users/:name">
        {(params) => <div>Hello, {params.name}!</div>}
      </Route>
      <Route path="/inbox" component={InboxPage} /> */}
    </div>
  )
}

export default App