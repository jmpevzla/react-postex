import { useFormik } from 'formik'
import { useCallback, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useLocation } from 'wouter'


interface TRegister {
  name: string,
  email: string,
  password: string,
  confPassword: string
}

function Register() {
  const [, setLoc] = useLocation()

  useEffect(() => {
    const token = window.localStorage.getItem('postex-token')
    if (token) {
      setLoc('/')
    }
  }, [])

  const validate = useCallback((values: TRegister) => {
    const errors: Record<string, string> = {} 
   
    if (values.name.length < 10 || values.name.length > 50) {
      errors.name = 'Name should be at least 10 until 50 alphanumerics'
    }
    if (!values.name) {
      errors.name = 'Required'
    }
   
    if (!values.email.match(/^[A-Za-z]/)) {
      errors.email = 'Email should begin with alphabetic char'
    }
    if (values.email.length < 6 || values.email.length > 50) {
      errors.email = 'Email should be at least 6 until 50 alphanumerics'
    }
    if (!values.email) {
      errors.email = 'Required'
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
      email: '',
      password: '',
      confPassword: ''
    },
    validate,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const res = await axios.post('/register', values)
       
        await Swal.fire({
          title: 'Success!',
          icon: 'success',
          text: res.data.message,
          toast: true,
          timerProgressBar: true,
          timer: 2000,
          position: 'top',
          showConfirmButton: false
        })
        
        try {
          window.localStorage.setItem('postex-token', res.data.token)
          setLoc('/')
        } catch(err) {
          console.error(err)
        }

      } catch (err: any) {
        console.error(err)
        Swal.fire({
          title: 'Error!',
          icon: 'error',
          text: `${err.message}`,
          confirmButtonText: 'Ok'
        })
      }
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
          <label htmlFor="inputEmail" className="label font-bold">Email</label>
          <input id="inputEmail" className="input input-bordered input-primary"
            type="email" name="email" 
            value={formFormik.values.email} 
            onChange={formFormik.handleChange} 
            />
          {formFormik.errors.email && 
            <p className="text-error font-bold w-48">{formFormik.errors.email}</p>}
        </div>
        <div className="mb-3">
          <label htmlFor="inputPassword" className="label font-bold">Password</label>
          <input id="inputPassword" className="input input-bordered input-primary" 
            type="password" name="password" 
            value={formFormik.values.password}
            onChange={formFormik.handleChange}
            />
          {formFormik.errors.password && 
            <p className="text-error font-bold w-48">{formFormik.errors.password}</p>}
        </div>
        <div className="mb-3">
          <label htmlFor="inputConfPassword" className="label font-bold">Confirm Password</label>
          <input id="inputConfPassword" className="input input-bordered input-primary" 
            type="password" name="confPassword" 
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