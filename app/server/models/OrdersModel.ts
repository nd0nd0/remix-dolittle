import mongoose, { Schema } from "mongoose";
import type { IUser } from "./UserModel";
export interface IOrder extends mongoose.Document {
  quantity: number;
  pizzaID: string;
  userID?: IUser["_id"];
  deliveryNote: string | "";
  active?: boolean;
  nonUserID: string;
  orderStatus?: string;
}

mongoose.Promise = global.Promise;
const OrderSchema: mongoose.Schema = new Schema<IOrder>(
  {
    quantity: {
      type: Number,
      required: true,
    },

    pizzaID: {
      type: String,
      required: true,
    },
    userID: {
      type: Schema.Types.ObjectId,
    },
    nonUserID: {
      type: String,
    },
    deliveryNote: {
      type: String,
      default: "",
    },
    active: {
      type: Boolean,
      default: false,
    },
    orderStatus: {
      type: String,
    },
  },
  { timestamps: true }
);
const Order =
  mongoose.models.Orders || mongoose.model<IOrder>("Orders", OrderSchema);

export default Order;
// global.OrderSchema =
// global.OrderSchema || mongoose.model("Orders", OrderSchema);
// export default global.OrderSchema;
