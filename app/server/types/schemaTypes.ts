import type { InferSchemaType } from "mongoose";
import type PizzaSchema from "../models/PizzaModel";
import type OrderSchema from "../models/OrdersModel";
import type UserSchema from "../models/UserModel";
export type Pizza = InferSchemaType<typeof PizzaSchema>;
export type Order = InferSchemaType<typeof OrderSchema>;
export type User = InferSchemaType<typeof UserSchema>;
