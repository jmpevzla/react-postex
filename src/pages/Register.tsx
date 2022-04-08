import { useCallback, useContext
  , useEffect, useState } from 'react'
import { Link, useLocation } from 'wouter'
import { useFormik } from 'formik'
import { useQueryClient } from 'react-query'
import Swal from 'sweetalert2'
import { setUserAction, userContext } from '@/contexts/userContext'
import type { TSignUp } from '@/types/auth-types'
import { setStUser, stOkLogin } from '@/extras/storage-extras'
import { useRegister } from '@/hooks/rq/auth-hrq'

export default Register

function Register() {
  const [, userDispatch] = useContext(userContext)!
  const [, setLocation] = useLocation()
  const [show, setShow] = useState(false)
  const queryClient = useQueryClient()
  const register = useRegister(queryClient)

  const validate = useCallback((values: TSignUp) => {
    const errors: Record<string, string> = {} 
    if (!values.name) {
      errors.name = 'Required'
    }
    if (!values.email) {
      errors.email = 'Required'
    }
    if (!values.password) {
      errors.password = 'Required'
    }
    if (!values.confPassword) {
      errors.email = 'Required'
    }
    return errors
  }, [])

  const formFormik = useFormik<TSignUp>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confPassword: ''
    },
    validate,
    validateOnChange: false,
    onSubmit: async (values) => {
      register.mutate(values, {
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
        <h1>Register</h1>

        {register.error && (<p>{register.error.message}</p>)}
        
        <form onSubmit={formFormik.handleSubmit}>
          <div>
            <label htmlFor="name">Name</label>
            <input id="name" type="text" name="name"  
              value={formFormik.values.name} 
              onChange={formFormik.handleChange} 
            />
            {formFormik.errors.name && 
              <p className="text-error font-bold w-50">{formFormik.errors.name}</p>}
          </div>
          
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
            <label htmlFor="confPassword">Confirm Password</label>
            <input id="confPassword" type="password" name="confPassword" 
              value={formFormik.values.confPassword} 
              onChange={formFormik.handleChange}   
            />
            {formFormik.errors.confPassword && 
              <p className="text-error font-bold w-50">{formFormik.errors.confPassword}</p>}
          </div>

          <div>
            <button type="submit">Register</button>
          </div>

          
        </form>

        <div>
          <Link href="/login">
            <a className="link">login</a>
          </Link>
        </div> 
      </div>
    )
  }

  return null
}