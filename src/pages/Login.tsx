import { useCallback, useContext } from "react";
import { Link, useLocation } from "wouter";
import { useFormik } from "formik";
import { useQueryClient } from "react-query";
import { setUserAction, userContext } from "@/contexts/userContext";
import type { TCredentials } from "@/types/auth-types";
import { setStUser } from "@/extras/storage-extras";
import { useLogin } from "@/hooks/rq/auth-hrq";
import MainLayout from "@/pages/layout/MainLayout";
import AuthLayout from "./layout/AuthLayout";
import useAuthInit from "@/hooks/useAuthInit";
import { showSuccess } from "@/extras/swal-extras";
import HeaderAuth from "@/components/HeaderAuth";

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
          await showSuccess(data.message)

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
          <div className="my-10 md:mx-4">
            <HeaderAuth text="Login" />

            <form className="md:mx-8" onSubmit={formFormik.handleSubmit}>
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
