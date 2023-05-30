import type { DataFunctionArgs } from "@remix-run/node";
import * as Z from "zod";
import { preprocessFormData } from "~/server/utils/validation";

export const deleteOrderSchema = Z.object({
  orderID: Z.string({ required_error: "Item ID is a must have" }),
  // userID: Z.string().optional(),
  // nonUserID: Z.string().optional(),
  _aciton: Z.string(),
});
export async function action({ request }: DataFunctionArgs) {
  const formData = await request.clone().formData();
  const data = deleteOrderSchema.safeParse(
    preprocessFormData(formData, deleteOrderSchema)
  );
  if (!data.success) {
    console.log(
      "🚀 ~ file: cart.tsx:69 ~ action ~ data:",
      data.error.flatten()
    );

    return null;
  }

  console.log("🚀 ~ file: cart.tsx:71 ~ action ~ data:", data.data);

  return null;
}

export async function loader() {
  console.log("you called me 🪴");
  return null;
}
