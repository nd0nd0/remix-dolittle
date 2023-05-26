import React, { useEffect, useState } from "react";
import type { IPizza } from "~/server/models/PizzaModel";
import Button from "../custom-ui/Button";
import { useRouteLoaderData } from "@remix-run/react";
import { type loader as rootLoader } from "~/root";
import { type SerializeFrom } from "@remix-run/node";
import type { IOrder } from "~/server/models/OrdersModel";

type Props = {
  pizza: IPizza;
  pizzas: IPizza[];
};

const Pizza = ({ pizza }: Props) => {
  const rootData = useRouteLoaderData("root") as SerializeFrom<
    typeof rootLoader
  >;
  const ORDERS = rootData?.USER_ORDERS as IOrder[];
  const [qty, setQtyState] = useState<number>();
  const [cartBtn, setCartBtn] = useState("Add to Cart");
  const setQty = (value: HTMLSelectElement["value"]) => {
    setQtyState(parseInt(value));
  };
  const orderInCart = ORDERS.find((order) => order.pizzaID === pizza._id);

  useEffect(() => {
    if (orderInCart) {
      setCartBtn("Update Order");
    } else {
      setCartBtn("Add to Cart");
    }
  }, [orderInCart]);
  return (
    <div className="mb-3">
      <h3 className="text-3xl">{pizza.title}</h3>
      <p className="text-sm my-2">{pizza.description}</p>

      <div className="flex flex-rol items-center w-full justify-between">
        {!orderInCart && cartBtn === "Add to Cart" ? (
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

        {cartBtn === "Add to Cart" ? (
          <Button>
            <>{cartBtn}</>
          </Button>
        ) : (
          <Button>
            <>{cartBtn}</>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Pizza;
