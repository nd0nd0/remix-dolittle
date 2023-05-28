import type { DataFunctionArgs, TypedResponse } from "@remix-run/node";
import { json } from "@remix-run/node";
import type {
  ShouldRevalidateFunction,
  V2_MetaFunction,
} from "@remix-run/react";
import { useActionData } from "@remix-run/react";
import Layout from "~/components/Layout";
import Pizzas from "~/components/pizza/Pizzas";
import type { IPizza } from "~/server/models/PizzaModel";
import { GET_PIZZAS } from "~/server/services/pizza.service.server";
import {
  getNonUserUUID,
  requireMiniUserAuth,
} from "~/server/utils/auth.server";
import { preprocessFormData, validationForm } from "~/server/utils/validation";

import * as Z from "zod";
import { ADD_NON_USER_ORDER } from "~/server/services/nonuser.server";

export const orderSchema = Z.object({
  pizzaID: Z.string({ required_error: "Item ID is a must have" }),
  // userID: Z.string().optional(),
  // nonUserID: Z.string().optional(),
  quantity: Z.number().min(1).max(5),
  deliveryNote: Z.string().optional(),
  active: Z.boolean().optional(),
  orderStatus: Z.string().optional(),
});

export async function loader({ request }: DataFunctionArgs): Promise<
  TypedResponse<{
    pizzas: IPizza[];
  }>
> {
  const pizzas = await GET_PIZZAS();
  return json({ pizzas: pizzas });
}

export async function action({ request }: DataFunctionArgs) {
  const user = await requireMiniUserAuth(request);
  const non_user_uuid = await getNonUserUUID(request);
  const formData = await request.clone().formData();

  //validate order information

  const data = orderSchema.safeParse(preprocessFormData(formData, orderSchema));

  if (!data.success) {
    return json({ errors: data.error.flatten() }, { status: 400 });
  }

  const orderObject = {
    non_user_uuid,
    ...data.data,
  };
  if (!user && non_user_uuid) {
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

  return json({ errors: null }, { status: 200 });
}

export async function shouldRevalidate({
  actionResult,
  defaultShouldRevalidate,
}: ShouldRevalidateFunction) {
  if (actionResult?.revalidate) {
    return false;
  }
  return defaultShouldRevalidate;
}

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export default function Index() {
  const actionData = useActionData<typeof action>();
  return (
    <Layout>
      <div className="container">
        <Pizzas />
      </div>
    </Layout>
  );
}
