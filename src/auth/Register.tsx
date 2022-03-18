import { useFormik } from 'formik'
import { useCallback } from 'react'

interface TRegister {
  name: string,
  username: string,
  password: string,
  confPassword: string
}

function Register() {
  const validate = useCallback((values: TRegister) => {
    const errors: Record<string, string> = {} 
   
    if (values.name.length < 10 || values.name.length > 50) {
      errors.name = 'Name should be at least 10 until 50 alphanumerics'
    }
    if (!values.name) {
      errors.name = 'Required'
    }
   
    if (!values.username.match(/^[A-Za-z]/)) {
      errors.username = 'Username should begin with alphabetic char'
    }
    if (values.username.length < 6 || values.username.length > 20) {
      errors.username = 'Username should be at least 6 until 20 alphanumerics'
    }
    if (!values.username) {
      errors.username = 'Required'
    }
    
    if (values.password !== values.confPassword) {
      errors.password = 'Password should be equal to confirm password'
    }
    if (!values.password.match(/^[A-Za-z]/)) {
      errors.password = 'Password* should begin with alphabetic char'
    }
    if (values.password.length < 6 || values.password.length > 14) {
      errors.password = 'Password should be at least 6 until 14 alphanumerics'
    }
    if (!values.password) {
      errors.password = 'Required'
    }
   
    return errors
  }, [])

  const formFormik = useFormik<TRegister>({
    initialValues: {
      name: '',
      username: '',
      password: '',
      confPassword: ''
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
        [text-shadow:0_4px_8px_rgba(0,0,0,0.15)]">Register</h1>
      <form onSubmit={formFormik.handleSubmit}>
        <div className="mb-3">
          <label htmlFor="inputName" className="label font-bold">Name</label>
          <input id="inputName" className="input input-bordered input-primary"
            name="name" 
            value={formFormik.values.name} 
            onChange={formFormik.handleChange} 
            />
          {formFormik.errors.name && 
            <p className="text-error font-bold w-48">{formFormik.errors.name}</p>}
        </div>
        <div className="mb-3">
          <label htmlFor="inputUsername" className="label font-bold">Username</label>
          <input id="inputUsername" className="input input-bordered input-primary"
            name="username" 
            value={formFormik.values.username} 
            onChange={formFormik.handleChange} 
            />
          {formFormik.errors.username && 
            <p className="text-error font-bold w-48">{formFormik.errors.username}</p>}
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
            <p className="text-error font-bold w-48">{formFormik.errors.password}</p>}
        </div>
        <div className="mb-3">
          <label htmlFor="inputConfPassword" className="label font-bold">Confirm Password</label>
          <input id="inputConfPassword" type="password"
            className="input input-bordered input-primary" 
            name="confPassword"
            value={formFormik.values.confPassword}
            onChange={formFormik.handleChange}
            />
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-primary">Login</button>
        </div>
      </form>
    </div>
  )
}

export default Register