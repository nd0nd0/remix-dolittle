import type {
  ActionArgs,
  DataFunctionArgs,
  TypedResponse,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { useState } from "react";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import Layout from "~/components/Layout";
import Button from "~/components/custom-ui/Button";
import type { IOrder } from "~/server/models/OrdersModel";
import type { IProduct } from "~/server/models/ProductModel";
import type { IUser } from "~/server/models/UserModel";
import { GET_PRODUCTS } from "~/server/services/product.service.server";
import { GET_USER_ORDERS } from "~/server/services/user.service.server";
import {
  authenticateUser,
  requireMiniUserAuth,
} from "~/server/utils/auth.server";
import useGetSubTotal from "~/utils/hooks/useGetSubTotal";
import { useUser } from "~/utils/misc";

type Props = {};

export async function loader({ request, params }: DataFunctionArgs): Promise<
  TypedResponse<{
    orders: IOrder[];
    products: IProduct[];
    user: IUser | {};
  }>
> {
  //user
  //TODO: Create a method that returns a user type

  const user = await authenticateUser(request);
  const userID = await requireMiniUserAuth(request);
  const products = await GET_PRODUCTS();

  if (!user) {
    //get user order by used._id
    redirect("/access?redirectTo=checkout?r=login");
  }
  if (userID && user) {
    const orders = await GET_USER_ORDERS(userID);

    // if (user.shippingAddress || user.shippingAddress.length === 0) {
    //   redirect("address");
    // } else {
    //   redirect("payment");
    // }

    return json({ orders: orders, products, user: user }, { status: 200 });
  }
  return json({ orders: [], products, user: {} }, { status: 400 });
}

export async function action({ request }: ActionArgs) {
  const actionData = await request.clone().formData();
  const buttonAction = actionData.get("_button-action");
  console.log(
    "🚀 ~ file: checkout.tsx:59 ~ action ~ buttonAction:",
    buttonAction
  );
  return null;
}

const StepSwitcher = () => {
  const location = useLocation();

  return (
    <div className="flex gap-2  items-center py-2 w-fit border-b ">
      <Button
        as="basic"
        className={`mr-3 ${
          location.pathname === "/checkout/address" &&
          "bg-slate-800 rounded-md p-2 active"
        }`}
        type="submit"
        name="_button-action"
        value="address"
      >
        <p>Address</p>
      </Button>
      <Button
        as="basic"
        className={`mr-3 ${
          location.pathname === "/checkout/payment" &&
          "bg-slate-800 rounded-md p-2 active"
        }`}
      >
        <p>Payment</p>
      </Button>
      <Button
        as="basic"
        className={`mr-3 ${
          location.pathname === "/checkout/confirmorder" &&
          "bg-slate-800 rounded-md p-2 active"
        }`}
      >
        <p>Confirm Order</p>
      </Button>
    </div>
  );
};
const Checkout = () => {
  const loaderData = useLoaderData<typeof loader>();
  const user = useUser();
  const orders = loaderData.orders as IOrder[];
  const products = loaderData.products as IProduct[];
  const [step, setStep] = useState(loaderData.user ? 3 : 1);
  const subTotal = useGetSubTotal(orders, products);
  const location = useLocation();
  return (
    <Layout>
      <div className=" container border-t ">
        <StepSwitcher />
        <div className="flex gap-2 ">
          <div className="w-3/5 mt-4">
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
                            {product.name}
                            {order.quantity < 1 ? null : <span>s</span>}
                          </p>

                          <p>
                            <span style={{ fontWeight: "bold" }}>@</span>{" "}
                            {product.price}
                          </p>
                        </div>
                      ));
                  })}
                </div>

                <hr style={{ height: "1px" }} />
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <div>
                    <h5>Total</h5>
                  </div>
                  <div>
                    <h5>{subTotal()}</h5>
                  </div>
                </div>
              </div>
            </div>
            {user.shippingAddress &&
              user.phoneNumber &&
              user.paymentMethod &&
              user.shippingAddress !== "" &&
              user.phoneNumber !== "" &&
              user.paymentMethod !== "" &&
              location.pathname === "/checkout/confirmorder" && (
                <>
                  <Button
                    className="mt-4"
                    type="submit"
                    // onClick={(e) => makeOrder(e)}
                  >
                    Make Order
                  </Button>
                  <p className="mt-4 text-sm">
                    Note: Before you submit your order, please make sure you
                    have your details aligned well. After your order is
                    confirmed for delivery it can't be updated again
                  </p>
                </>
              )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
