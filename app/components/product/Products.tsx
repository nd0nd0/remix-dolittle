import { useTypedRouteLoaderData } from "remix-typedjson";
import { type loader as rootLoader } from "~/routes/_index";
import Product from "./Product";
import { useRouteLoaderData } from "@remix-run/react";
import type { SerializeFrom } from "@remix-run/node";
import type { IProduct } from "~/server/models/ProductModel";

const SkeletonElement = ({ type }: { type: string }) => {
  const classes = `skeleton ${type}`;

  return <div className={classes}></div>;
};

const Shimmer = () => {
  return (
    <div className="shimmer-wrapper">
      <div className="shimmer"></div>
    </div>
  );
};

const SkeletonProduct = () => {
  return (
    <div className="skeleton-wrapper ">
      <SkeletonElement type="image" />
      <SkeletonElement type="title" />
      <SkeletonElement type="text" />
      <SkeletonElement type="text" />
      <SkeletonElement type="text" />
      <SkeletonElement type="text" />
      <SkeletonElement type="text" />
      <SkeletonElement type="text" />
      <SkeletonElement type="button" />
      <Shimmer />
    </div>
  );
};

const Products = () => {
  const routeData = useRouteLoaderData("routes/_index") as SerializeFrom<
    typeof rootLoader
  >;
  const products = (routeData?.products as IProduct[]) || [];
  return (
    <div className="flex flex-wrap items-center gap-4 justify-center ">
      {products.length === 0
        ? [1, 2, 3, 4, 5].map((item, index) => (
            <div
              key={index}
              className="sm:w-[300px] lg:w-1/4  py-3 px-4 border-slate-500 border rounded-lg"
            >
              <SkeletonProduct key={item} />
            </div>
          ))
        : products.map((product) => {
            return (
              <div
                key={product.id}
                className="sm:w-[300px] lg:w-1/4  py-3 px-4 border-slate-500 border rounded-lg"
              >
                <Product product={product} products={products} />
              </div>
            );
          })}
    </div>
  );
};

export default Products;
