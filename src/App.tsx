import { Link, Route } from 'wouter'
import Posts from './posts/List'
import Page401 from './errors/Page401'
import Page404 from './errors/Page404'
import Page500 from './errors/Page500'
import AboutMe from './aboutme/AboutMe'

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

      <Route path="/login">
        <p> LOGIN! </p>
      </Route>
      <Route path="/register">
        <p> REGISTER! </p>
      </Route>
      <Route path="/" component={Posts} />
      <Route path="/about-me" component={AboutMe} />
      <Route path="/401" component={Page401} />
      <Route path="/404" component={Page404} />
      <Route path="/500" component={Page500} />

      
      {/* <Route path="/users/:name">
        {(params) => <div>Hello, {params.name}!</div>}
      </Route>
      <Route path="/inbox" component={InboxPage} /> */}
    </div>
  )
}

export default App