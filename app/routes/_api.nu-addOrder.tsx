import type { DataFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { orderSchema } from "./_index";
import { preprocessFormData } from "~/server/utils/validation";
import { ADD_NON_USER_ORDER } from "~/server/services/nonuser.server";
import type { ShouldRevalidateFunction } from "@remix-run/react";

export async function action({ request }: DataFunctionArgs) {
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
