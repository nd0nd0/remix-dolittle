import { useCallback } from "react";
import type { IOrder } from "~/server/models/OrdersModel";
import type { IProduct } from "~/server/models/ProductModel";

const useGetSubTotal = (orders: IOrder[], products: IProduct[]) => {
  return useCallback(() => {
    const currentOrder = orders.map((order) => order.productID);
    const orderedProducts = products.filter((product) =>
      currentOrder.includes(product._id)
    );
    const orderArray = orders.map((item, i) =>
      Object.assign({}, item, orderedProducts[i])
    );
    const totalPrice = orderArray.map((order) => order.price * order.quantity);
    return totalPrice.reduce((a, c) => a + c, 0);
  }, [products, orders]);
};

export default useGetSubTotal;
