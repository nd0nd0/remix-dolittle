import mongoose from "mongoose";
// import validator from 'validator'
export interface IUser extends mongoose.Document {
  fullName: string;
  password: string;
  phoneNumber: string;
  paymentMethod: string;
  email: string;
  shippingAddress: string;
  deliveryNote: string;
  userToken: string;
}

mongoose.Promise = global.Promise;
const UserSchema: mongoose.Schema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    paymentMethod: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      // validate:[validator.isEmail, 'Please enter valid email address']
    },
    shippingAddress: {
      type: String,
    },
    deliveryNote: {
      type: String,
      maxLength: 255,
    },

    userToken: {
      type: String,
    },
  },
  { timestamps: true }
);

const User =
  mongoose.models.Users || mongoose.model<IUser>("Users", UserSchema);

export default User;
