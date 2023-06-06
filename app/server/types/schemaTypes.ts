import type { InferSchemaType } from "mongoose";
import type ProductSchema from "../models/ProductModel";
import type OrderSchema from "../models/OrdersModel";
import type UserSchema from "../models/UserModel";
export type Product = InferSchemaType<typeof ProductSchema>;
export type Order = InferSchemaType<typeof OrderSchema>;
export type User = InferSchemaType<typeof UserSchema>;
