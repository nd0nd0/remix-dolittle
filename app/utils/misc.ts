import type { SerializeFrom } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useRouteLoaderData } from "@remix-run/react";
import { type loader as rootLoader } from "~/root";
import type { IUser } from "~/server/models/UserModel";
import slugify from "slugify";
function isUser(user: any): user is IUser {
  return user && typeof user === "object" && typeof user.id === "string";
}
export function useOptionalUser(): IUser | undefined {
  const data = useRouteLoaderData("root") as SerializeFrom<typeof rootLoader>;
  if (!data || !data.user) {
    return undefined;
  }
  const user = data.user as IUser;
  return user;
}

export function useUser(): IUser {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }
  return maybeUser;
}

export function userNameToSlug(username: string) {
  return slugify(`${username}`, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });
}
