import { Link } from 'wouter'

export default Login

function Login() {
  return (
    <>
      <h1>Login</h1>
      <Link href="/register">
        <a className="link">register</a>
      </Link> |
    </>
  )
}