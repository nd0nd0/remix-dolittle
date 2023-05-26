import type { IOrder } from "~/server/models/OrdersModel";
import OrderSchema from "~/server/models/OrdersModel";

export async function GET_ORDERS() {
  const orders = await OrderSchema.find<IOrder>();
  return orders ? orders : [];
}

export async function GET_USER_ACTIVE_ORDERS(userID: string) {
  const activeOrders = await OrderSchema.find<IOrder>({
    active: true,
    userID: userID,
  });

  return activeOrders;
}
