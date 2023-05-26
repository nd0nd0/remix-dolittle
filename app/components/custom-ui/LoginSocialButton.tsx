import { Form } from "@remix-run/react";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { FC, HTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import type { SocialsProvider } from "remix-auth-socials";
import { classNameMerge } from "~/utils/client/classNameMerge";
import { Field } from "../forms/Field";

interface LoginSocialButtonProps
  extends HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ButtonVariants> {
  provider: SocialsProvider;
  label: string;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string | undefined;
  redirectTo: string | undefined;
}

const ButtonVariants = cva(
  "mt-3 flex h-12 w-full items-center justify-center gap-2 rounded ",
  {
    variants: {
      type: {
        default: "bg-transparent",
        google: "bg-red-800 capitalize text-white hover:bg-red-900 ",
      },
    },
    defaultVariants: {
      type: "google",
    },
  }
);

const LoginSocialButton: FC<LoginSocialButtonProps> = forwardRef<
  HTMLButtonElement,
  LoginSocialButtonProps
>(
  (
    { label, children, icon, provider, className, type, redirectTo, ...props },
    ref
  ) => {
    return (
      <Form
        action={`/auth/${provider}?redirectTo=${redirectTo}`}
        method="post"
        reloadDocument
      >
        <button
          type="submit"
          name={"_action"}
          value={type as string}
          ref={ref}
          className={classNameMerge(ButtonVariants({ type, className }))}
        >
          {icon}
          <span>{label}</span>
        </button>
        <Field type="hidden" name="redirectTo" value={redirectTo} />
      </Form>
    );
  }
);

LoginSocialButton.displayName = "loginSocialButton";

export default LoginSocialButton;
