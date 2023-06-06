import type { FC, HTMLAttributes, ReactNode } from "react";
import React, { forwardRef } from "react";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { Link, LinkProps } from "@remix-run/react";
import { BiPencil } from "react-icons/bi";
import { classNameMerge } from "~/utils/tailwind/classNameMerger";
const ButtonVariants = cva("rounded-none no-underline", {
  variants: {
    type: {
      main: "h-fit w-fit rounded-full bg-black p-1",
    },
  },
  defaultVariants: {
    type: "main",
  },
});

interface ButtonProps
  extends HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ButtonVariants> {
  to: LinkProps["to"];
}

const EditButton: FC<ButtonProps> = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, type, to, ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        className={classNameMerge(ButtonVariants({ type, className }))}
      >
        <Link to={to} className="m-0 p-0">
          <BiPencil color="white" size={"1rem"} />
        </Link>
      </button>
    );
  }
);

EditButton.displayName = "Button";

export default EditButton;
