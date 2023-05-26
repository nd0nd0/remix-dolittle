import { useTypedRouteLoaderData } from "remix-typedjson";
import { type loader as rootLoader } from "~/routes/_index";
import Pizza from "./Pizza";
import { useRouteLoaderData } from "@remix-run/react";
import { SerializeFrom } from "@remix-run/node";
import { IPizza } from "~/server/models/PizzaModel";

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

const SkeletonPizza = () => {
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

const Pizzas = () => {
  const routeData = useRouteLoaderData("routes/_index") as SerializeFrom<
    typeof rootLoader
  >;
  const pizzas = (routeData?.pizzas as IPizza[]) || [];
  return (
    <div className="flex flex-wrap items-center gap-4 justify-center ">
      {pizzas.length === 0
        ? [1, 2, 3, 4, 5].map((item, index) => (
            <div
              key={index}
              className="sm:w-[300px] lg:w-1/4  py-3 px-4 border-slate-500 border rounded-lg"
            >
              <SkeletonPizza key={item} />
            </div>
          ))
        : pizzas.map((pizza) => {
            return (
              <div
                key={pizza.id}
                className="sm:w-[300px] lg:w-1/4  py-3 px-4 border-slate-500 border rounded-lg"
              >
                <Pizza pizza={pizza} pizzas={pizzas} />
              </div>
            );
          })}
    </div>
  );
};

export default Pizzas;
