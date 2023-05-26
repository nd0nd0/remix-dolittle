import type { IOrder } from "~/server/models/OrdersModel";
import Order from "~/server/models/OrdersModel";

export async function GET_NON_USER_ORDERS(nonUserUUID: string) {
  const orders = await Order.find<IOrder>({
    nonUserID: "6f221458-a649-445f-8335-b3511e854505", //nonUserUUID
  });

  return orders ? orders : [];
}
