import type { IProduct } from "~/server/models/ProductModel";
import ProductSchema from "~/server/models/ProductModel";

export async function GET_PRODUCTS() {
  const products = await ProductSchema.find<IProduct>().lean<IProduct[]>();
  return products ? products : [];
}
