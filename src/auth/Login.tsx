import { useFormik } from 'formik'
import { useCallback } from 'react'

interface TLogin {
  username: string,
  password: string
}

function Login() {
  const validate = useCallback((values: TLogin) => {
    const errors: Record<string, string> = {} 
    if (!values.username) {
      errors.username = 'Required'
    }
    if (!values.password) {
      errors.password = 'Required'
    }
    return errors
  }, [])

  const formFormik = useFormik<TLogin>({
    initialValues: {
      username: '',
      password: ''
    },
    validate,
    validateOnChange: false,
    onSubmit: (values) => {
      console.log(values)
    },
  })

  return (
    <div className="flex flex-col items-center">
      <h1 className="block text-4xl font-bold font-mono 
        [text-shadow:0_4px_8px_rgba(0,0,0,0.15)]">Login</h1>
      <form onSubmit={formFormik.handleSubmit}>
        <div className="mb-3">
          <label htmlFor="inputUsername" className="label font-bold">Username</label>
          <input id="inputUsername" className="input input-bordered input-primary"
            name="username" 
            value={formFormik.values.username} 
            onChange={formFormik.handleChange} 
            />
          {formFormik.errors.username && 
            <p className="text-error font-bold">{formFormik.errors.username}</p>}
        </div>
        <div className="mb-3">
          <label htmlFor="inputPassword" className="label font-bold">Password</label>
          <input id="inputPassword" type="password"
            className="input input-bordered input-primary" 
            name="password"
            value={formFormik.values.password}
            onChange={formFormik.handleChange}
            />
          {formFormik.errors.password && 
            <p className="text-error font-bold">{formFormik.errors.password}</p>}
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-primary">Login</button>
        </div>
      </form>
    </div>
  )
}

export default Login