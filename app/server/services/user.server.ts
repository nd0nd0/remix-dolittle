import type { IUser } from "../models/UserModel";
import UserSchema from "../models/UserModel";

export async function GET_USER_BY_ID(userID: string) {
  const user = await UserSchema.findById<IUser>(userID);
  return user;
}
