import { Link } from "@remix-run/react";
import type { FC } from "react";
import { FcGoogle } from "react-icons/fc";
import { SocialsProvider } from "remix-auth-socials";
import LoginSocialButton from "../custom-ui/LoginSocialButton";
import Login from "./Login";
import Register from "./Register";
import { FormProps } from "~/utils/forms/formTypes";

interface Props {
  formType?: FormProps;
  setFormType?: (
    value: FormProps | ((prevVal: FormProps) => FormProps)
  ) => void;
  redirectTo?: string;
}

//TODO: add toggle for those who want to sign up as Hosts

const UniversalForm: FC<Props> = ({ formType, setFormType, redirectTo }) => {
  return (
    <div className="bg-grey-lighter flex min-h-screen flex-col">
      <div className="container mx-auto flex max-w-sm flex-1 flex-col items-center justify-center px-2">
        <div className="h-auto w-[400px] rounded bg-white px-6 py-8 text-dark shadow-md">
          <div className="flex w-full items-center justify-between">
            <p
              className={` cursor-pointer  text-dark hover:opacity-100 ${
                formType === "register" ? "opacity-100" : "opacity-50"
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
  );
};
export default UniversalForm;
