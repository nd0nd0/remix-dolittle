import { redirect } from "@remix-run/node";
import bcrypt from "bcrypt";
import type { MongooseError } from "mongoose";
import type { IUser } from "../models/UserModel";
import UserSchema from "../models/UserModel";
import { createUserSession, safeRedirect } from "../utils/auth.server";
import { commitSession, getSession } from "../utils/session.server";
import type { IOrder } from "../models/OrdersModel";
import Order from "../models/OrdersModel";
import User from "../models/UserModel";
type userOrder = {
  quantity: number;
  productID: string;
  deliveryNote?: string | undefined;
  active?: boolean | undefined;
  orderStatus?: string | undefined;
  userID: string | null;
};

const parsedID = (id: string) => {
  const stringifiedID: string = JSON.parse(id);

  return stringifiedID;
};

export async function GET_USER_BY_ID(userID: string) {
  const user = await UserSchema.findById<IUser>({
    _id: parsedID(userID),
  }).lean<IUser>();
  return user;
}
export async function GET_USER_BY_EMAIL(email: string) {
  const user = await UserSchema.findOne<IUser>({
    email: email,
  });
  return user;
}
export async function GOOGLE_STRATEGY_CREATE_USER(
  email: string,
  name: string
): Promise<IUser> {
  return await UserSchema.create<IUser>(
    {
      email: email,
      fullName: name,
    }
    // function (err: MongooseError, newUser: IUser) {
    //   if (err) throw err;
    //   return newUser;
    // }
  );

  // return newUser;
}
export async function FORM_STRATEGY_CREATE_USER(
  email: string,
  username: string,
  password: string
): Promise<IUser> {
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await UserSchema.create<IUser>(
    {
      email: email,
      fullName: username,
      password: hashedPassword,
    }
    // function (err: MongooseError, newUser: IUser) {
    //   if (err) throw err;
    //   return newUser;
    // }
  );
  console.log("🚀 ~ file: user.service.server.ts:69 ~ newUser:", newUser);

  return newUser;
}
export async function VERIFY_LOGIN(email: string, password: string) {
  const user = await UserSchema.findOne<IUser>({
    email: email,
  }).lean<IUser>();
  if (!password || !user?.password) {
    return null;
  }
  const isValidPassword = await bcrypt.compare(password, user?.password);

  if (!isValidPassword) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = user;

  return userWithoutPassword;
}
export async function LOGIN_USER(
  email: string,
  password: string,
  redirectTo: string = ""
) {
  const user = await UserSchema.findOne<IUser>(
    {
      email: email,
    },
    (err: MongooseError, user: IUser) => {
      if (err) return err;
      return user;
    }
  );

  const foundPassword = await bcrypt.compare(password, user?.password!);

  if (!user || !foundPassword) {
    return { error: "Incorrect Login" };
  }

  return createUserSession(user.id, redirectTo);
}
export async function GET_USER_ORDERS(userID: string) {
  const id = JSON.parse(userID);
  const orders = await Order.find<IOrder>({
    userID: id,
  }).lean<IOrder[]>();

  return orders ? orders : [];
}
export async function ADD_USER_ORDER({
  productID,
  quantity,
  deliveryNote,
  active,
  orderStatus,
  userID,
}: userOrder) {
  const id = JSON.parse(userID!);
  const addOrder = await Order.create({
    userID: id,
    productID,
    quantity,
    orderStatus,
    deliveryNote,
    active,
  });

  return addOrder;
}
export async function CHANGE_QUANTITY_USER_ORDER(
  orderID: string,
  quantity: number,
  userID: string
) {
  const updatedOrder = await Order.updateOne<IOrder>(
    { userID: parsedID(userID), _id: orderID },
    {
      quantity: quantity,
    }
  )
    .then((res) => {
      console.log("🚀 ~ file: nonuser.server.ts:47 ~ res:", res);
      return {};
    })
    .catch((e) => {
      console.log("🚀 ~ file: nonuser.server.ts:48 ~ e:", e);
    });

  return updatedOrder;
}
export async function DELETE_USER_ORDER(orderID: string, userID: string) {
  const deleteOrder = await Order.findByIdAndDelete<IOrder>({
    // userID: parsedID(userID),/
    _id: orderID,
  })
    .then((res) => {
      console.log("🚀 ~ file: nonuser.server.ts:47 ~ res:", res);
      return {};
    })
    .catch((e) => {
      console.log("🚀 ~ file: nonuser.server.ts:48 ~ e:", e);
    });
  return deleteOrder;
}

export async function ADD_SHIPPING_ADDRESS_USER(
  userID: string,
  shippingAddress: string
) {
  const userShippingAddress = await User.updateOne<IUser>(
    { _id: parsedID(userID) },
    { shippingAddress: shippingAddress }
  )
    .then((res) => {
      console.log("🚀 ~ file: user.server.ts:47 ~ res:", res);
      return {};
    })
    .catch((e) => {
      console.log("🚀 ~ file: user.server.ts:48 ~ e:", e);
    });

  return userShippingAddress;
}

export async function CLEAR_SHIPPING_ADDRESS_USER(userID: string) {
  const userShippingAddress = await User.updateOne<IUser>(
    { _id: parsedID(userID) },
    { shippingAddress: "" }
  )
    .then((res) => {
      console.log("🚀 ~ file: user.server.ts:47 ~ res:", res);
      return {};
    })
    .catch((e) => {
      console.log("🚀 ~ file: user.server.ts:48 ~ e:", e);
    });

  return userShippingAddress;
}
