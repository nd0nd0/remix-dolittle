import type { DataFunctionArgs, TypedResponse } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import React, { useEffect, useState } from "react";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import Button from "~/components/custom-ui/Button";
import type { IOrder } from "~/server/models/OrdersModel";
import type { IProduct } from "~/server/models/ProductModel";
import { IUser } from "~/server/models/UserModel";
import { GET_NON_USER_ORDERS } from "~/server/services/nonuser.server";
import { GET_PRODUCTS } from "~/server/services/product.service.server";
import { authenticateUser, getNonUserUUID } from "~/server/utils/auth.server";
import useGetSubTotal from "~/utils/hooks/useGetSubTotal";

type Props = {};

export async function loader({ request }: DataFunctionArgs): Promise<
  TypedResponse<{
    orders: IOrder[];
    products: IProduct[];
    user: {};
  }>
> {
  //user
  //TODO: Create a method that returns a user type

  const user = await authenticateUser(request);

  const products = await GET_PRODUCTS();
  // const isUser = await useUser(request);
  const isUser = true;
  const non_user_uuid = await getNonUserUUID(request);

  if (!isUser) {
    //get user order by used._id
    redirect("/login?redirectTo=checkout");
  }
  const orders = await GET_NON_USER_ORDERS(non_user_uuid!);
  // const orders: IOrder[] = [];
  return json({ orders: orders, products, user: {} }, { status: 200 });
}

const Checkout = () => {
  const loaderData = useLoaderData<typeof loader>();
  const orders = loaderData.orders as IOrder[];
  const products = loaderData.products as IProduct[];
  const [step, setStep] = useState(loaderData.user ? 3 : 1);
  const subTotal = useGetSubTotal(orders, products);
  // useEffect(() => {
  //   if (userAuth) {
  //     if (userDetails.shippingAddress === "") {
  //       setStep(3);
  //     } else {
  //       setStep(4);
  //     }
  //   }
  //   dispatch(getProducts());
  // }, [dispatch, userAuth]);

  return (
    <div className=" container mt-5">
      {step >= 3 ? (
        <div className="mb-4 flex ">
          {step > 3 ? (
            <Button onClick={() => setStep(step - 1)} className="mr-3">
              <AiOutlineArrowLeft />
            </Button>
          ) : null}

          {step === 5 ? null : (
            <Button onClick={() => setStep(step + 1)}>
              <AiOutlineArrowRight />
            </Button>
          )}
        </div>
      ) : null}
      <div className="flex gap-2">
        <div className="w-3/5">
          <Outlet />
        </div>
        <div className="flex flex-col w-3/12">
          <div className="">
            <h6 className="p-4">Order Summary</h6>
            <div>
              <div>
                {orders.map((order) => {
                  return products
                    .filter((product) => product._id === order.productID)
                    .map((product) => (
                      <div
                        key={product._id}
                        className="mb-2 flex gap-4 justify-between items-center"
                      >
                        <p>{order.quantity}</p>
                        <p>
                          {product.title}
                          {order.quantity < 1 ? null : <span>s</span>}
                        </p>

                        <p>
                          <span style={{ fontWeight: "bold" }}>@</span>{" "}
                          {product.prices}
                        </p>
                      </div>
                    ));
                })}
              </div>

              <hr style={{ height: "1px" }} />
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <div>
                  <h5>Total</h5>
                </div>
                <div>
                  <h5>{subTotal()}</h5>
                </div>
              </div>
            </div>
          </div>
          {/* {user ? ( */}
          <Button
            className="mt-4"
            type="submit"
            // onClick={(e) => makeOrder(e)}
          >
            Make Order
          </Button>
          {/* ) : null} */}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
