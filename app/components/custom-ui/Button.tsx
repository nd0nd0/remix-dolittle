import type {
  ButtonHTMLAttributes,
  FC,
  HTMLAttributes,
  ReactNode,
} from "react";
import React, { forwardRef } from "react";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { classNameMerge } from "~/utils/tailwind/classNameMerger";
const ButtonVariants = cva("rounded-none no-underline", {
  variants: {
    as: {
      basic: " text-white ",
      main: "bg-blue-600  rounded-md text-white   py-2 px-2 hover:bg-blue-700",
      cart: "bg-black p-2 text-white  xsm:p-7 md:p-4 xsm:mt-8 md:mt-16 xsm:text-md lg:text-sm ",
      secondary:
        "text-black bg-blue-500  xsm:p-5 md:p-4 xsm:mt-0 md:mt-8 hover:bg-highlighter  active:bg-highlighter",
      share:
        "text-slate-50 bg-cta p-2 rounded-sm  xsm:p-5 md:p-4 xsm:mt-0 md:mt-8 hover:bg-hover  active:bg-hover",
      filter:
        "text-inherit bg-transparent p-0 hover:bg-highlighter focus:bg-transparent",
      delete: "bg-red-600  rounded-md text-white   py-2 px-2 hover:bg-blue-700",
    },
  },
  defaultVariants: {
    as: "main",
  },
});

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ButtonVariants> {
  children: ReactNode;

  value?: string;
  type?: "button" | "submit" | "reset" | undefined; //TODO: This type should be in ...props of HTMLButtonElement
}

const Button: FC<ButtonProps> = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, as, type, ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        className={classNameMerge(ButtonVariants({ as, className }))}
        type={type}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
