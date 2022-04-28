import { useCallback, useContext } from "react";
import { Link, useLocation } from "wouter";
import { useFormik } from "formik";
import { useQueryClient } from "react-query";
import Swal from "sweetalert2";
import { setUserAction, userContext } from "@/contexts/userContext";
import type { TCredentials } from "@/types/auth-types";
import { setStUser, stOkLogin } from "@/extras/storage-extras";
import { useLogin } from "@/hooks/rq/auth-hrq";
import MainLayout from "@/pages/layout/MainLayout";
import AuthLayout from "./layout/AuthLayout";
import useAuthInit from "@/hooks/useAuthInit";

export default Login;

function Login() {
  const [, userDispatch] = useContext(userContext)!;
  const [, setLocation] = useLocation();
  const show = useAuthInit()
  const queryClient = useQueryClient();
  const login = useLogin(queryClient);

  const validate = useCallback((values: TCredentials) => {
    const errors: Record<string, string> = {};
    if (!values.email) {
      errors.email = "Required";
    }
    if (!values.password) {
      errors.password = "Required";
    }
    return errors;
  }, []);

  const formFormik = useFormik<TCredentials>({
    initialValues: {
      email: "",
      password: "",
    },
    validate,
    validateOnChange: false,
    onSubmit: async (values) => {
      login.mutate(values, {
        onSuccess: async (data) => {
          await Swal.fire({
            title: "Success!",
            icon: "success",
            text: data.message,
            toast: true,
            timerProgressBar: true,
            timer: 1000,
            position: "top",
            showConfirmButton: false,
          });

          userDispatch({
            type: setUserAction,
            payload: data.user,
          });

          setStUser(data.token, data.user.id);
          setLocation("/");
        },
        onError: (error) => {
          if (error.status === 401) {
            error.message = "Credentials invalid!, try again";
          }
        },
      });
    },
  });

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
                <span className="text-violet-700">Login</span> Your Account
              </h1>
            </header>

            <form className="mx-8" onSubmit={formFormik.handleSubmit}>
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
                  placeholder="Password"
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
                <div className="min-h-8">
                  {login.error && (
                    <p className="text-error text-center">
                      {login.error.message}
                    </p>
                  )}
                </div>

                <button type="submit" className="w-full btn btn-primary">
                  Login
                </button>
              </div>
            </form>

            <div className="text-center">
              <Link href="/register">
                <a className="link !no-underline">Create Account</a>
              </Link>
            </div>
          </div>
        </AuthLayout>
      </MainLayout>
    );
  }
  return null;
}
