import type { DataFunctionArgs, TypedResponse } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import type { MongooseError } from "mongoose";
import { useCallback, useEffect, useState } from "react";
import * as Z from "zod";
import Layout from "~/components/Layout";
import Button from "~/components/custom-ui/Button";
import type { IOrder } from "~/server/models/OrdersModel";
import type { IProduct } from "~/server/models/ProductModel";
import { GET_PRODUCTS } from "~/server/services/product.service.server";
import {
  CHANGE_QUANTITY_USER_ORDER,
  DELETE_USER_ORDER,
  GET_USER_ORDERS,
} from "~/server/services/user.service.server";
import {
  authenticateUser,
  requireMiniUserAuth,
} from "~/server/utils/auth.server";
import { preprocessFormData } from "~/server/utils/validation";
import { useOptionalUser, useUser } from "~/utils/misc";
type Props = {};
export const deleteOrderSchema = Z.object({
  orderID: Z.string({ required_error: "Item ID is a must have" }),
});
export const changeOrderQtySchema = Z.object({
  orderID: Z.string({ required_error: "Item ID is a must have" }),
  quantity: Z.number().min(1).max(5),
  // userID: Z.string().optional(),
});

export async function loader({ request }: DataFunctionArgs): Promise<
  TypedResponse<{
    orders: IOrder[];
    products: IProduct[];
  }>
> {
  //user
  //TODO: Create a method that returns a user type
  const user = await authenticateUser(request);
  const userID = await requireMiniUserAuth(request);
  if (!user) {
    redirect("/access?r=login");
  }

  const products = await GET_PRODUCTS();

  if (user && userID) {
    const orders = await GET_USER_ORDERS(userID);

    return json({ orders: orders, products }, { status: 200 });
  }

  return json(
    {
      orders: [],
      products,
    },
    { status: 400 }
  );
}

export async function action({ request }: DataFunctionArgs) {
  const userID = await requireMiniUserAuth(request);
  const formData = await request.clone().formData();
  const actionType = formData.get("_action");

  if (actionType === "delete-order") {
    const data = deleteOrderSchema.safeParse(
      preprocessFormData(formData, deleteOrderSchema)
    );
    if (!data.success) {
      return json({ errors: data.error.flatten() }, { status: 400 });
    }

    const { orderID } = data.data;

    if (userID) {
      try {
        await DELETE_USER_ORDER(orderID, userID);
        return json({ errors: null, revalidate: true }, { status: 200 });
      } catch (error) {
        console.log("🚀 ~ file: cart.tsx:88 ~ action ~ error:", error);
        return json({ errors: error, revalidate: false }, { status: 200 });
      }
    }
  }
  if (actionType === "change-qty") {
    const data = changeOrderQtySchema.safeParse(
      preprocessFormData(formData, changeOrderQtySchema)
    );
    if (!data.success) {
      return json({ errors: data.error.flatten() }, { status: 400 });
    }
    const { orderID, quantity } = data.data;

    if (userID) {
      try {
        await CHANGE_QUANTITY_USER_ORDER(orderID, quantity, userID);
        return json({ errors: null, revalidate: true }, { status: 200 });
      } catch (error) {
        console.log("🚀 ~ file: cart.tsx:106 ~ action ~ error:", error);
        const err = error as MongooseError;

        return json(
          { errors: err.message, revalidate: false },
          { status: 400 }
        );
      }
    }
  }

  return json({ message: null, errors: null }, { status: 200 });
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

const Cart = (props: Props) => {
  const fetcher = useFetcher();
  const data = useLoaderData<typeof loader>();
  const user = useOptionalUser();
  const orders = data.orders as IOrder[];
  const products = data.products as IProduct[];
  const [subTotalFigures, setSubTotal] = useState(0);

  const changeQty = (qty: HTMLSelectElement["value"], id: string) => {
    const convertStringQty = parseInt(qty);
    fetcher.submit(
      {
        _action: "change-qty",
        quantity: `${convertStringQty}`,
        orderID: `${id}`,
      },
      {
        // action: "/api/form/deleteOrder", //TODO: API form deleteOrder not found
        method: "post",
      }
    );
  };

  const orderDelete = (id: string) => {
    fetcher.submit(
      {
        _action: "delete-order",
        orderID: `${id}`,
      },
      {
        // action: "/api/form/deleteOrder", //TODO: API form deleteOrder not found
        method: "post",
      }
    );
  };

  const getCount = orders.reduce((acc, curr) => acc + curr.quantity, 0);

  const getCountUser = useCallback(() => {
    const currentOrder = orders.map((order) => order.productID);
    const orderedProducts = products.filter((product) =>
      currentOrder.includes(product._id)
    );
    const orderArray = orders.map((item, i) =>
      Object.assign({}, item, orderedProducts[i])
    );
    const totalPrice = orderArray.map((order) => order.price * order.quantity);
    return totalPrice.reduce((a, c) => a + c, 0);
  }, [products, orders]);

  useEffect(() => {
    setSubTotal(getCountUser);
  }, [subTotalFigures, getCountUser, user]);

  return (
    <Layout>
      <div className="container">
        {orders.length !== 0 && (
          <div className="overflow-x-auto">
            <table className="table w-3/4">
              {/* head */}
              <thead>
                <tr>
                  <th></th>
                  <th>Product</th>
                  <th>Pieces</th>
                  <th>Price</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <>
                  {orders.map((order) => {
                    return products
                      .filter((product) => product._id === order.productID)
                      .map((product, index) => (
                        <tr key={product._id} className="mb-2">
                          <th>{index + 1}</th>
                          <th>{product.name}</th>
                          <th>
                            <select
                              placeholder={`${order.quantity}`}
                              name="Quantity"
                              onChange={(e) =>
                                changeQty(e.target.value, order._id)
                              }
                              className="px-4 py-2"
                            >
                              <option
                                value={order.quantity}
                                selected
                                disabled
                                hidden
                              >
                                {order.quantity}
                              </option>
                              <option value="1" label="1">
                                1
                              </option>
                              <option value="2" label="2">
                                2
                              </option>
                              <option value="3" label="3">
                                3
                              </option>
                              <option value="4" label="4">
                                4
                              </option>
                              <option value="5" label="5">
                                5
                              </option>
                            </select>
                          </th>
                          <th>
                            <span style={{ marginRight: "10px" }}>shs</span>
                            {product.price}
                          </th>
                          <th>
                            <Button
                              type="submit"
                              name="_action"
                              value={"delete-order"}
                              onClick={(e) => orderDelete(order._id)}
                              as="delete"
                            >
                              <span>Delete</span>
                            </Button>
                          </th>
                        </tr>
                      ));
                  })}
                </>
              </tbody>
            </table>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="alert alert-warning shadow-lg w-1/3">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span> Ohh snap! You have to add something here!!</span>
            </div>
          </div>
        ) : (
          <div className="container">
            <div className="mt-4 mb-4 flex items-center justify-between p-4 w-3/4 rounded-md bg-[#e8e8e8] ">
              <div className="flex content-between">
                <div className="">
                  <h3 className="text-[#3a3a3a]">
                    SubTotal for&nbsp;
                    <span>{getCount}</span>
                    &nbsp;pieces
                  </h3>
                </div>

                <div className="">
                  <h5 className="text-[#3a3a3a]">shs {getCountUser()}</h5>
                </div>
              </div>

              <div className="mt-3">
                <Link to={`/checkout/?subTotal=${subTotalFigures}`}>
                  <Button className="btnFocus">Proceed to Checkout</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
