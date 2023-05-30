import type { SerializeFrom } from "@remix-run/node";
import { Link, useFetcher, useRouteLoaderData } from "@remix-run/react";
import { useState } from "react";
import { type loader as rootLoader } from "~/root";
import type { IOrder } from "~/server/models/OrdersModel";
import type { IPizza } from "~/server/models/PizzaModel";
import { useOptionalUser } from "~/utils/misc";
import Button from "../custom-ui/Button";

type Props = {
  pizza: IPizza;
  pizzas: IPizza[];
};

const Pizza = ({ pizza }: Props) => {
  const rootData = useRouteLoaderData("root") as SerializeFrom<
    typeof rootLoader
  >;
  const user = useOptionalUser();
  const ORDERS = rootData?.USER_ORDERS as IOrder[];
  const fetcher = useFetcher();
  const [qty, setQtyState] = useState<number>();
  const setQty = (value: HTMLSelectElement["value"]) => {
    setQtyState(parseInt(value));
  };
  const orderInCart = ORDERS.find((order) => order.pizzaID === pizza._id);
  const addToCart = async () => {
    fetcher.submit(
      {
        pizzaID: pizza._id,
        quantity: `${qty || 1}`,
        deliveryNote: "",
        active: `${false}`,
        orderStatus: "pending",
      },
      {
        // action: "form/addOrder",
        method: "post",
      }
    );
  };
  return (
    <div className="mb-3">
      <h3 className="text-3xl">{pizza.title}</h3>
      <p className="text-sm my-2">{pizza.description}</p>

      <div className="flex flex-rol items-center w-full justify-between">
        {!orderInCart ? (
          <select
            // value={qty}
            name="Quantity"
            className="p-2 border border-black rounded-md"
            onChange={(e) => setQty(e.target.value)}
          >
            <option value="1" label="Pieces" hidden></option>
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
        ) : null}

        <form>
          <Button
            name="_action"
            value={"order"}
            onClick={() => !orderInCart && addToCart()}
          >
            {orderInCart ? <Link to="/cart">Update Cart</Link> : "Add to cart"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Pizza;
