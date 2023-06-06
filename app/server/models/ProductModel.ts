import mongoose, { Schema } from "mongoose";
export interface IProduct extends mongoose.Document {
  name: string;
  price: number;
  SKU: string;
  onSale: boolean;
  description: string;
  image: string;
  extraOptions: [
    {
      name: string;
      price: number;
    }
  ];
}
mongoose.Promise = global.Promise;

const ProductSchema: mongoose.Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 60,
      unique: true,
    },
    price: {
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
          name: { type: String, required: true },
          price: { type: Number, required: true },
        },
      ],
    },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Products ||
  mongoose.model<IProduct>("Products", ProductSchema);

export default Product;
// global.ProductSchema =
// global.ProductSchema || mongoose.model("Products", ProductSchema);
// export default global.ProductSchema;
