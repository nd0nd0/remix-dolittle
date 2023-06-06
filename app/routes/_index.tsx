import type { DataFunctionArgs, TypedResponse } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type {
  ShouldRevalidateFunction,
  V2_MetaFunction,
} from "@remix-run/react";
import * as Z from "zod";
import Layout from "~/components/Layout";
import Products from "~/components/product/Products";
import type { IProduct } from "~/server/models/ProductModel";
import { GET_PRODUCTS } from "~/server/services/product.service.server";
import { ADD_USER_ORDER } from "~/server/services/user.service.server";
import { requireMiniUserAuth } from "~/server/utils/auth.server";
import { preprocessFormData } from "~/server/utils/validation";

export const orderSchema = Z.object({
  productID: Z.string({ required_error: "Item ID is a must have" }),
  // userID: Z.string().optional(),
  nonUserID: Z.string().optional().nullable(),
  quantity: Z.number().min(1).max(5),
  deliveryNote: Z.string().optional(),
  active: Z.boolean().optional(),
  orderStatus: Z.string().optional(),
});

export async function loader({ request }: DataFunctionArgs): Promise<
  TypedResponse<{
    products: IProduct[];
  }>
> {
  const products = await GET_PRODUCTS();
  return json({ products: products });
}

export async function action({ request }: DataFunctionArgs) {
  const userID = await requireMiniUserAuth(request);
  const formData = await request.clone().formData();

  //validate order information

  const data = orderSchema.safeParse(preprocessFormData(formData, orderSchema));

  if (!data.success) {
    return json({ errors: data.error.flatten() }, { status: 400 });
  }

  if (userID) {
    const orderObject = {
      userID,
      ...data.data,
    };

    const addUserOrder = await ADD_USER_ORDER(orderObject);
    return json(
      { newOrder: addUserOrder, errors: null, revalidate: true },
      { status: 200 }
    );
  }

  return redirect(`/access?redirectTo=${"/"}?r=login`);
}

export async function shouldRevalidate({
  // @ts-ignore
  actionResult,
  // @ts-ignore
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
  return (
    <Layout>
      <div className="container">
        <Products />
      </div>
    </Layout>
  );
}
