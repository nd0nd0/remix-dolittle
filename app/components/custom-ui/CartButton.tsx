import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { FC, HTMLAttributes } from "react";
import { forwardRef } from "react";
import { classNameMerge } from "~/utils/tailwind/classNameMerger";
const ButtonVariants = cva("rounded-none no-underline decoration-none", {
  variants: {
    type: {
      main: "flex gap-2 items-center justify-center text-white rounded-md bg-slate-900 py-2 px-3 relative hover:bg-slate-800 ",
    },
  },
  defaultVariants: {
    type: "main",
  },
});

interface ButtonProps
  extends HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ButtonVariants> {
  itemsInCart: number;
}

const CartButton: FC<ButtonProps> = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, type, itemsInCart, ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        className={classNameMerge(ButtonVariants({ type, className }))}
      >
        Cart
        <span className="bg-blue-600 text-white rounded-sm px-2 text-sm absolute -top-2 -right-2  ">
          {itemsInCart}
        </span>
      </button>
    );
  }
);

CartButton.displayName = "Button";

export default CartButton;
