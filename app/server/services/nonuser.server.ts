import type { IOrder } from "~/server/models/OrdersModel";
import Order from "~/server/models/OrdersModel";
type nonUserOrder = {
  quantity: number;
  pizzaID: string;
  deliveryNote?: string | undefined;
  active?: boolean | undefined;
  orderStatus?: string | undefined;
  non_user_uuid: string | null;
};
export async function GET_NON_USER_ORDERS(nonUserUUID: string) {
  const orders = await Order.find<IOrder>({
    nonUserID: nonUserUUID, //nonUserUUID
  });

  return orders ? orders : [];
}

export async function ADD_NON_USER_ORDER({
  pizzaID,
  quantity,
  deliveryNote,
  active,
  orderStatus,
  non_user_uuid,
}: nonUserOrder) {
  const addOrder = await Order.create({
    nonUserID: non_user_uuid,
    pizzaID,
    quantity,
    orderStatus,
    deliveryNote,
    active,
  });

  return addOrder;
}
