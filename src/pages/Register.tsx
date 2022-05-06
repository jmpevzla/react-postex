import { useCallback, useContext } from 'react'
import { Link, useLocation } from 'wouter'
import { useFormik } from 'formik'
import { useQueryClient } from 'react-query'
import Swal from 'sweetalert2'
import { setUserAction, userContext } from '@/contexts/userContext'
import type { TSignUp } from '@/types/auth-types'
import { setStUser } from '@/extras/storage-extras'
import { useRegister } from '@/hooks/rq/auth-hrq'
import MainLayout from './layout/MainLayout'
import AuthLayout from './layout/AuthLayout'
import useAuthInit from '@/hooks/useAuthInit'

export default Register

function Register() {
  const [, userDispatch] = useContext(userContext)!
  const [, setLocation] = useLocation()
  const show = useAuthInit()
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
      errors.confPassword = 'Required'
    }
    if (values.password != values.confPassword) {
      errors.confPassword = 'Password is not equal to confirm password'
    }
    
    if (Object.keys(errors).length > 0) {
      formFormik.setFieldValue('password', '')
      formFormik.setFieldValue('confPassword', '')
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
    onSubmit: async (values, helpers) => {
      
      register.mutate(values, {
        onSuccess: async (data) => {
          await Swal.fire({
            title: 'Success!',
            icon: 'success',
            text: data.message,
            background: 'var(--background-auth)',
            color: 'var(--txt)',
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

  if (show) {
    return (
      <MainLayout>
        <AuthLayout>
          <div className="my-10 mx-4">
            <header>
              <p className="text-xl">Hello !</p>
              <p className="text-violet-600 font-bold text-2xl">
                Welcome to Postex.io
              </p>
              <h1 className="text-center text-lg mt-4">
                <span className="text-violet-700">Create</span> Your Account
              </h1>
            </header>

            <form className="mx-8" onSubmit={formFormik.handleSubmit}>
              <div className="my-3">
                <input
                  id="name"
                  type="text"
                  name="name"
                  className="border-blue-600 w-full p-2 form-control input tracking-wider"
                  placeholder="Your Name"
                  value={formFormik.values.name}
                  onChange={formFormik.handleChange}
                />
                {formFormik.errors.name && (
                  <p className="text-error text-sm font-bold w-50">
                    *{formFormik.errors.name}
                  </p>
                )}
              </div>
              
              <div className="my-3">
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="border-blue-600 w-full p-2 form-control input tracking-wider"
                  placeholder="Email Address"
                  value={formFormik.values.email}
                  onChange={formFormik.handleChange}
                />
                {formFormik.errors.email && (
                  <p className="text-error text-sm font-bold w-50">
                    *{formFormik.errors.email}
                  </p>
                )}
              </div>

              <div className="my-3">
                <input
                  id="password"
                  type="password"
                  name="password"
                  className="border-blue-600 w-full p-2 form-control input tracking-wider"
                  placeholder="Your Password"
                  value={formFormik.values.password}
                  onChange={formFormik.handleChange}
                />
                {formFormik.errors.password && (
                  <p className="text-error text-sm font-bold w-50">
                    *{formFormik.errors.password}
                  </p>
                )}
              </div>

              <div className="my-3">
                <input
                  id="confPassword"
                  type="password"
                  name="confPassword"
                  className="border-blue-600 w-full p-2 form-control input tracking-wider"
                  placeholder="Confirm Your Password"
                  value={formFormik.values.confPassword}
                  onChange={formFormik.handleChange}
                />
                {formFormik.errors.confPassword && (
                  <p className="text-error text-sm font-bold w-50">
                    *{formFormik.errors.confPassword}
                  </p>
                )}
              </div>

              <div className="my-3">
                <div className="min-h-8">
                  {register.error && (
                    <p className="text-error text-center">
                      {register.error.message}
                    </p>
                  )}
                </div>

                <button type="submit" className="w-full btn btn-primary">
                  Create
                </button>
              </div>
            </form>

            <div className="text-center">
              <Link href="/login">
                <a className="link !no-underline">Login in your Account</a>
              </Link>
            </div>
          </div>
        </AuthLayout>
      </MainLayout>
    )
  }

  return null
}