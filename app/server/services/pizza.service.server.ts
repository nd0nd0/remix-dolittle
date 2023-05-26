import type { IPizza } from "~/server/models/PizzaModel";
import PizzaSchema from "~/server/models/PizzaModel";

export async function GET_PIZZAS() {
  const pizzas = await PizzaSchema.find<IPizza>().lean<IPizza[]>();
  return pizzas ? pizzas : [];
}
