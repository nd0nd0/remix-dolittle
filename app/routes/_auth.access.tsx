import type { DataFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
import { useNavigate } from "@remix-run/react";
import { Link, useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useState } from "react";

import toast, { Toaster } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { SocialsProvider } from "remix-auth-socials";
import LoginSocialButton from "~/components/custom-ui/LoginSocialButton";
import Login from "~/components/forms/Login";
import Register from "~/components/forms/Register";
import * as Z from "zod";
import { preprocessFormData } from "~/server/utils/validation";
import { authenticator, createUserSession } from "~/server/utils/auth.server";
import { FormStrategy } from "remix-auth-form";
import { FORM_STRATEGY_CREATE_USER } from "~/server/services/user.service.server";
import { AuthorizationError } from "remix-auth";
import { FormProps } from "~/utils/forms/formTypes";
import Button from "~/components/custom-ui/Button";
import { BiArrowBack } from "react-icons/bi";

export const userLogin = Z.object({
  email: Z.string({ required_error: "This is a required field" }).email({
    message: "Invalid Email",
  }),
  password: Z.string({ required_error: "This is a required field" }),
  redirectTo: Z.string().optional(),
});
export const userRegistration = Z.object({
  username: Z.string()
    .nonempty({ message: "A username would be nice here!!  " })
    .min(4),
  email: Z.string().email({
    message: "Invalid Email",
  }),
  password: Z.string({ required_error: "This is a required field" }),
  redirectTo: Z.string(),
});

export async function action({ request }: DataFunctionArgs) {
  const formData = await request.clone().formData();
  const _action = formData.get("_action");

  if (_action === "login") {
    const loginFormData = userLogin.safeParse(
      preprocessFormData(formData, userLogin)
    );

    if (!loginFormData.success) {
      return json({ errors: loginFormData.error.flatten() }, { status: 400 });
    }

    const { email, password, redirectTo } = loginFormData.data;
    try {
      const user_id = await authenticator.authenticate(
        FormStrategy.name,
        request,
        {
          throwOnError: true,
        }
      );

      return await createUserSession(user_id, redirectTo);
    } catch (error) {
      if (error instanceof AuthorizationError) {
        return json(
          {
            errors: {
              form: error.message,
            },
            fields: { email: email, password: password },
          },
          {
            status: 400,
          }
        );
        // here the error is related to the authentication process
      }
    }
  }

  if (_action === "register") {
    console.log("I am here 😀");

    const registrationFormData = userRegistration.safeParse(
      preprocessFormData(formData, userRegistration)
    );
    console.log(
      "🚀 ~ file: _auth.access.tsx:83 ~ action ~ registrationFormData:",
      registrationFormData
    );

    if (!registrationFormData.success) {
      return json(
        { errors: registrationFormData.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password, redirectTo, username } = registrationFormData.data;

    const newUser = await FORM_STRATEGY_CREATE_USER(email, username, password);
    if (!newUser) {
      return json(
        {
          errors: {
            user: "Something went wrong while creating your account",
          },
        },
        {
          status: 400,
        }
      );
    }
    try {
      const user = await authenticator.authenticate(
        FormStrategy.name,
        request,
        {
          throwOnError: true,
        }
      );
      return await createUserSession(user, redirectTo!);
    } catch (error) {
      if (error instanceof AuthorizationError) {
        return json(
          {
            errors: {
              form: error.message,
            },
          },
          {
            status: 400,
          }
        );
      }
    }
  }
}

export const meta: V2_MetaFunction = ({ matches }) => {
  let rootModule = matches.find((match) => match.id === "root");

  return [
    ...(rootModule?.meta ?? [])?.filter((meta) => !("title" in meta)),
    { title: "Login/Register to your Dolittle Account" },
  ];
};

const Access = () => {
  const actionData = useActionData();
  const [searchParams] = useSearchParams();
  const r = searchParams.get("r") as FormProps;
  const [formType, setFormType] = useState<FormProps>(r || FormProps.Login);
  const redirectTo = searchParams.get("redirectTo") || "/";
  const navigate = useNavigate();
  const notify = (message: string) => toast.error(message);
  useEffect(() => {
    actionData?.errors["user"] && notify(actionData?.errors["user"]);
    actionData?.errors!["form"] && notify(actionData?.errors["form"]);
  }, [actionData?.errors]);

  return (
    <>
      <div className="bg-grey-lighter flex min-h-screen flex-col">
        <div className="container mx-auto flex max-w-sm flex-1 flex-col items-center justify-center px-2">
          <div className="w-full rounded bg-white px-6 py-8 text-dark shadow-md">
            <Toaster
              position="top-center"
              toastOptions={{
                // Define default options
                className: "",
                duration: 5000,
                error: {
                  style: {
                    background: "red",
                    color: "white",
                  },
                },
              }}
            />
            <div className="focus:outline-non fixed inset-0 z-50 overflow-y-auto outline-none backdrop-blur-lg transition-all duration-150 ease-linear overflow-x-hidden">
              <Button
                className="absolute top-5 left-10 z-30"
                onClick={() => navigate(-1)}
                type="button"
              >
                <BiArrowBack />
              </Button>
              <div className="flex items-center justify-center ">
                <div className="bg-grey-lighter flex min-h-screen flex-col">
                  <div className="container mx-auto flex max-w-sm flex-1 flex-col items-center justify-center px-2">
                    <div className="h-auto w-[400px] rounded bg-white px-6 py-8 text-dark shadow-md">
                      <div className="flex w-full items-center justify-between">
                        <p
                          className={` cursor-pointer  text-dark hover:opacity-100 ${
                            formType === "register"
                              ? "opacity-100"
                              : "opacity-50"
                          }`}
                          onClick={() => setFormType?.(FormProps.Register)}
                        >
                          Register
                        </p>
                        <p
                          className={` cursor-pointer  text-dark hover:opacity-100 ${
                            formType === "login" ? "opacity-100" : "opacity-50"
                          }`}
                          onClick={() => setFormType?.(FormProps.Login)}
                        >
                          Log in
                        </p>
                      </div>
                      <hr className="w-full" />
                      {formType === "register" ? (
                        <Register redirectTo={redirectTo} />
                      ) : (
                        <Login redirectTo={redirectTo} />
                      )}
                      <LoginSocialButton
                        type={"google"}
                        redirectTo={redirectTo}
                        icon={<FcGoogle />}
                        provider={SocialsProvider.GOOGLE}
                        label={
                          formType === "register"
                            ? "Sign up with Google"
                            : "Sign in with Google"
                        }
                        className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded"
                      />
                      {formType === "register" && (
                        <div className="mt-4 text-center text-sm text-dark">
                          By signing up, you agree to the
                          <Link
                            to="/terms-of-service"
                            className="border-grey-dark border-b text-dark no-underline"
                          >
                            Terms of Service
                          </Link>
                          and
                          <Link
                            to="/privacy-policy"
                            className="border-grey-dark border-b text-dark no-underline"
                          >
                            Privacy Policy
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Access;
