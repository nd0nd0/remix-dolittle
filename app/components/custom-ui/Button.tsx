import type { FC, HTMLAttributes, ReactNode } from "react";
import React, { forwardRef } from "react";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { classNameMerge } from "~/utils/classNameMerger";
const ButtonVariants = cva("rounded-none no-underline", {
  variants: {
    type: {
      main: "bg-blue-600  rounded-md text-white   py-2 px-2 hover:bg-blue-700",
      cart: "bg-black p-2 text-white  xsm:p-7 md:p-4 xsm:mt-8 md:mt-16 xsm:text-md lg:text-sm ",
      secondary:
        "text-black bg-blue-500  xsm:p-5 md:p-4 xsm:mt-0 md:mt-8 hover:bg-highlighter  active:bg-highlighter",
      share:
        "text-slate-50 bg-cta p-2 rounded-sm  xsm:p-5 md:p-4 xsm:mt-0 md:mt-8 hover:bg-hover  active:bg-hover",
      filter:
        "text-inherit bg-transparent p-0 hover:bg-highlighter focus:bg-transparent",
    },
  },
  defaultVariants: {
    type: "main",
  },
});

interface ButtonProps
  extends HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ButtonVariants> {
  children: ReactNode;
}

const Button: FC<ButtonProps> = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, type, ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        className={classNameMerge(ButtonVariants({ type, className }))}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
