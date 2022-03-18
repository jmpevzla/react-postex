import { useCallback, useEffect } from 'react'
import { useFormik } from 'formik'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useLocation } from 'wouter'

interface TLogin {
  email: string,
  password: string
}

function Login() {
  const [, setLoc] = useLocation()

  const validate = useCallback((values: TLogin) => {
    const errors: Record<string, string> = {} 
    if (!values.email) {
      errors.email = 'Required'
    }
    if (!values.password) {
      errors.password = 'Required'
    }
    return errors
  }, [])

  const formFormik = useFormik<TLogin>({
    initialValues: {
      email: '',
      password: ''
    },
    validate,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const login = await axios.post('/login', values)
        
        await Swal.fire({
          title: 'Success!',
          icon: 'success',
          text: login.data.message,
          toast: true,
          timerProgressBar: true,
          timer: 2000,
          position: 'top',
          showConfirmButton: false
        })
        
        try {
          window.localStorage.setItem('postex-token', login.data.token)
          setLoc('/')
        } catch(err) {
          console.error(err)
        }

      } catch (err: any) {
        console.error(err)
        const status = err.response.status === 401 
          ? 'Credentials invalid or user not found' 
          : null
        Swal.fire({
          title: 'Error!',
          icon: 'error',
          text: `${status || err.message}`,
          confirmButtonText: 'Ok'
        })
      }
    },
  })

  useEffect(() => {
    const token = window.localStorage.getItem('postex-token')
    if (token) {
      setLoc('/')
    }
  }, [])

  return (
    <div className="flex flex-col items-center">
      <h1 className="block text-4xl font-bold font-mono 
        [text-shadow:0_4px_8px_rgba(0,0,0,0.15)]">Login</h1>
      <form onSubmit={formFormik.handleSubmit}>
        <div className="mb-3">
          <label htmlFor="inputEmail" className="label font-bold">Email</label>
          <input id="inputEmail" className="input input-bordered input-primary"
            type="email" name="email" 
            value={formFormik.values.email} 
            onChange={formFormik.handleChange} 
            />
          {formFormik.errors.email && 
            <p className="text-error font-bold w-50">{formFormik.errors.email}</p>}
        </div>
        <div className="mb-3">
          <label htmlFor="inputPassword" className="label font-bold">Password</label>
          <input id="inputPassword" className="input input-bordered input-primary" 
            type="password" name="password"
            value={formFormik.values.password}
            onChange={formFormik.handleChange}
            />
          {formFormik.errors.password && 
            <p className="text-error font-bold w-50">{formFormik.errors.password}</p>}
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-primary">Login</button>
        </div>
      </form>
    </div>
  )
}

export default Login