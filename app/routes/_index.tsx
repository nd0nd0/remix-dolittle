import type { DataFunctionArgs, TypedResponse } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
import Layout from "~/components/Layout";
import Pizzas from "~/components/pizza/Pizzas";
import type { IPizza } from "~/server/models/PizzaModel";
import { GET_PIZZAS } from "~/server/services/pizza.service.server";
export async function loader({ request }: DataFunctionArgs): Promise<
  TypedResponse<{
    pizzas: IPizza[];
  }>
> {
  const pizzas = await GET_PIZZAS();
  return json({ pizzas: pizzas });
}

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export default function Index() {
  return (
    <Layout>
      <div className="container">
        <Pizzas />
      </div>
    </Layout>
  );
}
