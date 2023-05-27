import type { DataFunctionArgs, SerializeFrom } from "@remix-run/node";
import { Link, useRouteLoaderData } from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import Layout from "~/components/Layout";
import Button from "~/components/custom-ui/Button";
import { type loader as rootLoader } from "~/root";
import type { IOrder } from "~/server/models/OrdersModel";
import { GET_PIZZAS } from "~/server/services/pizza.service.server";
import { useOptionalUser } from "~/utils/misc";
type Props = {};

export async function loader({ request }: DataFunctionArgs) {
  const pizzas = await GET_PIZZAS();
  return typedjson({
    pizzas: pizzas,
  });
}

const Cart = (props: Props) => {
  const user = useOptionalUser();
  const { pizzas } = useTypedLoaderData<typeof loader>();
  console.log("🚀 ~ file: cart.tsx:23 ~ Cart ~ pizzas:", pizzas);
  const rootData = useRouteLoaderData("root") as SerializeFrom<
    typeof rootLoader
  >;
  const ORDERS = rootData?.USER_ORDERS as IOrder[];
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

  const getCount = () => {
    return ORDERS.reduce((quantity, order) => order.quantity + quantity, 0);
  };

  const getCountUser = useCallback(() => {
    const currentOrder = ORDERS.map((order) => order.pizzaID);
    const orderedPizzas = pizzas.filter((pizza) =>
      currentOrder.includes(pizza._id)
    );
    const orderArray = ORDERS.map((item, i) =>
      Object.assign({}, item, orderedPizzas[i])
    );
    const totalPrice = orderArray.map((order) => order.prices * order.quantity);
    return totalPrice.reduce((a, c) => a + c, 0);
  }, [pizzas, ORDERS]);

  useEffect(() => {
    setSubTotal(getCountUser);

    // dispatch(sendTotal(subTotalFigures));
  }, [subTotalFigures, getCountUser, user]);

  return (
    <Layout>
      <div className="container">
        {ORDERS.length === 0 ? null : (
          <div className="flex flex-row gap-4 mr-1">
            <div>
              <h5>Pizza Flavor</h5>
            </div>
            <div>
              <h5>Pieces</h5>
            </div>
            <div className="ml-6">
              <h5>Price</h5>
            </div>
            <div></div>
          </div>
        )}

        {ORDERS.map((order) => {
          return (
            <div className="flex items-center" key={order.pizzaID}>
              <div>
                <ul>
                  {pizzas
                    .filter((pizza) => pizza._id === order.pizzaID)
                    .map((pizza) => (
                      <>
                        <li key={pizza._id} className="mb-2">
                          <div className="flex content-between">
                            <div>{pizza.title}</div>
                            <div>
                              <select
                                placeholder={`${order.quantity}`}
                                name="Quantity"
                                style={{ padding: "6px" }}
                                onChange={(e) =>
                                  changeQty(e.target.value, order.id)
                                }
                                className="form-select form-select-sm"
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
                            </div>
                            <div>
                              <span style={{ marginRight: "10px" }}>shs</span>
                              {pizza.prices}
                            </div>
                            <div>
                              <Button onClick={(e) => orderDelete(order.id)}>
                                <span>Delete</span>
                              </Button>
                            </div>
                          </div>
                        </li>
                      </>
                    ))}
                </ul>
              </div>
            </div>
          );
        })}

        {ORDERS.length === 0 ? (
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
            <div className="mt-4 mb-4 flex p-4 content-around w-2/3 rounded-md bg-[#e8e8e8] text-[#3a3a3a]">
              <div className="flex content-between">
                <div className="">
                  <h3>
                    SubTotal for&nbsp;
                    <span>{getCount()}</span>
                    &nbsp;pieces
                  </h3>
                </div>

                <div className="">
                  <h5>shs {getCountUser()}</h5>
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
