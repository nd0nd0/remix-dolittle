// import { User } from '@prisma/client';
import { Form, useActionData } from "@remix-run/react";
import type { FC } from "react";
import { Toaster } from "react-hot-toast";
import { Field } from "./Field";
interface RedirectProps {
  redirectTo: string | undefined;
}
const Register: FC<RedirectProps> = ({ redirectTo }) => {
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
            type="text"
            label="User Name"
            name="username"
            placeholder="Ndondo"
            error={actionData?.errors.fieldErrors["username"]}
          />
        </div>

        <div className="mb-4">
          <Field
            type="email"
            label="Email"
            name="email"
            placeholder="abc@mail.com"
            error={actionData?.errors.fieldErrors["email"]}
          />
        </div>

        <div className="mb-4">
          <Field
            type="password"
            label="Password"
            name="password"
            placeholder="******"
            error={actionData?.errors.fieldErrors["password"]}
          />
        </div>
        <input type="hidden" name="redirectTo" value={redirectTo} />

        <button
          type="submit"
          className="my-1 w-full rounded bg-dark text-white py-3 text-center text-mainText focus:outline-none hover:bg-black"
          // disabled={!props.isValid}
          name="_action"
          value={"register"}
        >
          Register
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
export default Register;
