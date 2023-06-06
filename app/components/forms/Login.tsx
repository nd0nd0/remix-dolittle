import { Form, useActionData } from "@remix-run/react";
import type { FC } from "react";
import { Toaster } from "react-hot-toast";
import { Field } from "./Field";

interface LoginProps {
  redirectTo: string | undefined;
}

const Login: FC<LoginProps> = ({ redirectTo }) => {
  const actionData = useActionData();
  return (
    <>
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

      <Form className="mt-2 w-full" method="post">
        <div className="mb-4">
          <Field
            label="Email"
            type="email"
            name="email"
            placeholder="abc@mail.com"
            error={actionData?.errors["email"]}
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <Field
            label="Password"
            name="password"
            type="password"
            placeholder="******"
            error={actionData?.errors["password"]}
            className="w-full"
          />
        </div>
        <Field type="hidden" name="redirectTo" value={redirectTo} />

        <button
          type="submit"
          className="my-1 w-full rounded bg-dark py-3 text-center text-mainText focus:outline-none hover:bg-black text-white"
          // disabled={!props.isValid}
          name="_action"
          value={"login"}
        >
          Login
        </button>
        <div>
          <div className="mt-3 flex items-center justify-between">
            <hr className="w-full" />
            <span className="mb-1 p-2 text-dark">OR</span>
            <hr className="w-full" />
          </div>
        </div>
      </Form>
    </>
  );
};
export default Login;
