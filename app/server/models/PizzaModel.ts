import mongoose, { Schema } from "mongoose";
export interface IPizza extends mongoose.Document {
  title: string;
  prices: number;
  SKU: string;
  onSale: boolean;
  description: string;
  image: string;
  extraOptions: [
    {
      text: string;
      price: number;
    }
  ];
}
mongoose.Promise = global.Promise;

const PizzaSchema: mongoose.Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 60,
      unique: true,
    },
    prices: {
      type: Number,
      required: true,
    },
    SKU: {
      type: String,
      required: true,
    },
    onSale: {
      type: Boolean,
      required: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 200,
    },
    image: {
      type: String,
      //TODO: Host on AWS or any image service provider
      // required: true,
    },
    extraOptions: {
      type: [
        {
          text: { type: String, required: true },
          price: { type: Number, required: true },
        },
      ],
    },
  },
  { timestamps: true }
);

const Pizza =
  mongoose.models.Pizzas || mongoose.model<IPizza>("Pizzas", PizzaSchema);

export default Pizza;
// global.PizzaSchema =
// global.PizzaSchema || mongoose.model("Pizzas", PizzaSchema);
// export default global.PizzaSchema;
