import { useCallback, useContext
  , useEffect, useState } from 'react'
import { Link, useLocation } from 'wouter'
import { useFormik } from 'formik'
import { useQueryClient } from 'react-query'
import Swal from 'sweetalert2'
import { setUserAction, userContext } from '@/contexts/userContext'
import type { TCredentials } from '@/types/auth-types'
import { setStUser, stOkLogin } from '@/extras/storage-extras'
import { useLogin } from '@/hooks/rq/auth-hrq'

export default Login

function Login() {
  const [, userDispatch] = useContext(userContext)!
  const [, setLocation] = useLocation()
  const [show, setShow] = useState(false)
  const queryClient = useQueryClient()
  const login = useLogin(queryClient)

  const validate = useCallback((values: TCredentials) => {
    const errors: Record<string, string> = {} 
    if (!values.email) {
      errors.email = 'Required'
    }
    if (!values.password) {
      errors.password = 'Required'
    }
    return errors
  }, [])

  const formFormik = useFormik<TCredentials>({
    initialValues: {
      email: '',
      password: ''
    },
    validate,
    validateOnChange: false,
    onSubmit: async (values) => {
      login.mutate(values, {
        onSuccess: async (data) => {
          await Swal.fire({
            title: 'Success!',
            icon: 'success',
            text: data.message,
            toast: true,
            timerProgressBar: true,
            timer: 2000,
            position: 'top',
            showConfirmButton: false
          })

          userDispatch({
            type: setUserAction,
            payload: data.user
          })

          setStUser(data.token, data.user.id)
          setLocation('/')
        },
        onError: (error) => {
          if (error.status === 401) {
            error.message = 'Credentials invalid!, try again'
          }
        }
      })
    }
  })

  useEffect(() => {
    if (stOkLogin()) {
      return setLocation('/')
    }
    setShow(true)
  }, [])

  if (show) {
    return (
      <div>
        <h1>Login</h1>

        {login.error && (<p>{login.error.message}</p>)}
        
        <form onSubmit={formFormik.handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" name="email"  
              value={formFormik.values.email} 
              onChange={formFormik.handleChange} 
            />
            {formFormik.errors.email && 
              <p className="text-error font-bold w-50">{formFormik.errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" name="password" 
              value={formFormik.values.password} 
              onChange={formFormik.handleChange}   
            />
            {formFormik.errors.password && 
              <p className="text-error font-bold w-50">{formFormik.errors.password}</p>}
          </div>

          <div>
            <button type="submit">Login</button>
          </div>

          
        </form>

        <div>
          <Link href="/register">
            <a className="link">register</a>
          </Link>
        </div> 
      </div>
    )
  }
  return null
}