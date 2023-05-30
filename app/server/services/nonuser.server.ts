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

export async function DELETE_NON_USER_ORDER(
  orderID: string,
  non_user_uuid: string
) {
  const deleteOrder = await Order.findByIdAndDelete<IOrder>({
    nonUserID: non_user_uuid,
    _id: orderID,
  });

  return deleteOrder;
}
export async function CHANGE_QUANTITY_NON_USER_ORDER(
  orderID: string,
  quantity: number,
  non_user_uuid: string
) {
  const updatedOrder = await Order.updateOne<IOrder>(
    { nonUserID: non_user_uuid, _id: orderID },
    {
      quantity: quantity,
    }
  )
    .then((res) => {
      console.log("🚀 ~ file: nonuser.server.ts:47 ~ res:", res);
      return {};
    })
    .catch((e) => {
      console.log("🚀 ~ file: nonuser.server.ts:48 ~ e:", e);
    });

  return updatedOrder;
}
