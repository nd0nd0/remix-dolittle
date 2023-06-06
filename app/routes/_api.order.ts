import type { DataFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  ADD_NON_USER_ORDER,
  GET_NON_USER_ORDERS,
} from "~/server/services/nonuser.server";
import { preprocessFormData } from "~/server/utils/validation";
import * as Z from "zod";
import type { ShouldRevalidateFunction } from "@remix-run/react";

export const orderSchema = Z.object({
  productID: Z.string({ required_error: "Item ID is a must have" }),
  // userID: Z.string().optional(),
  nonUserID: Z.string().optional().nullable(),
  quantity: Z.number().min(1).max(5),
  deliveryNote: Z.string().optional(),
  active: Z.boolean().optional(),
  orderStatus: Z.string().optional(),
});

export async function loader({ request }: DataFunctionArgs) {
  const non_user_uuid = new URL(request.url).searchParams.get("nui");
  if (!non_user_uuid)
    return json(
      { order: [], error: "Unable to fetch orders!! Missing UUID" },
      { status: 404 }
    );
  const orders = await GET_NON_USER_ORDERS(non_user_uuid);
  return json(
    {
      orders: orders,
      error: null,
      non_user_uuid,
    },
    { status: 200 }
  );
}

export async function action({ request }: DataFunctionArgs) {
  console.log("Iam here 🍀");

  const non_user_uuid = new URL(request.url).searchParams.get("nui");
  const formData = await request.clone().formData();

  //validate order information

  const data = orderSchema.safeParse(preprocessFormData(formData, orderSchema));

  if (!data.success) {
    return json({ errors: data.error.flatten() }, { status: 400 });
  }

  if (!non_user_uuid) {
    return json(
      { order: [], error: "Unable to fetch orders!! Missing UUID" },
      { status: 404 }
    );
  }

  const orderObject = {
    non_user_uuid,
    ...data.data,
  };
  try {
    const addNonUserOrder = await ADD_NON_USER_ORDER(orderObject);

    return json(
      { newOrder: addNonUserOrder, errors: null, revalidate: true },
      { status: 200 }
    );
  } catch (error) {
    return json(
      { newOrder: null, errors: error, revalidate: false },
      { status: 200 }
    );
  }
}

// export async function shouldRevalidate({
//   // @ts-ignore
//   actionResult,
//   // @ts-ignore
//   defaultShouldRevalidate,
// }: ShouldRevalidateFunction) {
//   if (actionResult?.revalidate) {
//     return false;
//   }
//   return defaultShouldRevalidate;
// }
