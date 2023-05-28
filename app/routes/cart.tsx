import type { DataFunctionArgs, TypedResponse } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";
import Layout from "~/components/Layout";
import Button from "~/components/custom-ui/Button";
import type { IOrder } from "~/server/models/OrdersModel";
import type { IPizza } from "~/server/models/PizzaModel";
import { GET_NON_USER_ORDERS } from "~/server/services/nonuser.server";
import { GET_PIZZAS } from "~/server/services/pizza.service.server";
import {
  getNonUserUUID,
  requireMiniUserAuth,
} from "~/server/utils/auth.server";
import { useOptionalUser } from "~/utils/misc";
type Props = {};

export async function loader({ request }: DataFunctionArgs): Promise<
  TypedResponse<{
    orders: IOrder[];
    pizzas: IPizza[];
  }>
> {
  //user
  //TODO: Create a method that returns a user type

  const pizzas = await GET_PIZZAS();
  const user_id = await requireMiniUserAuth(request);
  const non_user_uuid = await getNonUserUUID(request);

  const universal_user = {
    isUser: user_id,
    isNonUser: non_user_uuid,
  };

  if (universal_user.isUser) {
    //get user order by used._id
    return json({ orders: [], pizzas }, { status: 400 });
  }

  if (universal_user.isNonUser) {
    const orders = await GET_NON_USER_ORDERS(universal_user.isNonUser);

    return json({ orders: orders, pizzas }, { status: 200 });
  }

  return json(
    {
      orders: [],
      pizzas,
    },
    { status: 400 }
  );
}

const Cart = (props: Props) => {
  const user = useOptionalUser();
  const data = useLoaderData<typeof loader>();
  // const rootData = useRouteLoaderData("root") as SerializeFrom<
  //   typeof rootLoader
  // >;
  const orders = data.orders as IOrder[];
  const pizzas = data.pizzas as IPizza[];
  const [subTotalFigures, setSubTotal] = useState(0);
  const changeQty = (qty: HTMLSelectElement["value"], id: string) => {
    const convertStringqty = parseInt(qty);

    if (user) {
      //change user order quantity
      // dispatch(changeUserQuantity(convertStringqty, id));
      console.log("user-✅", convertStringqty, id);
    } else {
      console.log("user-❎", convertStringqty, id);
      //change non user order quantity

      // dispatch(changeQuantityNonUser(convertStringqty, id));
    }
  };

  const orderDelete = (id: string) => {
    console.log("clicked");
    // if (userAuth) {
    //   dispatch(deleteUserOrder(id));
    // } else {
    //   dispatch(deleteOrderNonUser(id));
    // }
  };

  const getCount = orders.reduce((acc, curr) => acc + curr.quantity, 0);

  const getCountUser = useCallback(() => {
    const currentOrder = orders.map((order) => order.pizzaID);
    const orderedPizzas = pizzas.filter((pizza) =>
      currentOrder.includes(pizza._id)
    );
    const orderArray = orders.map((item, i) =>
      Object.assign({}, item, orderedPizzas[i])
    );
    const totalPrice = orderArray.map((order) => order.prices * order.quantity);
    return totalPrice.reduce((a, c) => a + c, 0);
  }, [pizzas, orders]);

  useEffect(() => {
    setSubTotal(getCountUser);

    // dispatch(sendTotal(subTotalFigures));
  }, [subTotalFigures, getCountUser, user]);

  return (
    <Layout>
      <div className="container">
        <div className="overflow-x-auto">
          <table className="table w-3/4">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Pizza</th>
                <th>Pieces</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <>
                {orders.map((order) => {
                  return pizzas
                    .filter((pizza) => pizza._id === order.pizzaID)
                    .map((pizza, index) => (
                      <tr key={pizza._id} className="mb-2">
                        <th>{index++}</th>
                        <th>{pizza.title}</th>
                        <th>
                          <select
                            placeholder={`${order.quantity}`}
                            name="Quantity"
                            onChange={(e) =>
                              changeQty(e.target.value, order.id)
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
                          {pizza.prices}
                        </th>
                        <th>
                          <Button
                            type={"delete"}
                            onClick={(e) => orderDelete(order.id)}
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
