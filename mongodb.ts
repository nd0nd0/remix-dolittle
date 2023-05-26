import type { Mongoose } from "mongoose";
import { Schema } from "mongoose";

declare global {
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
}
