import type { DataFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { signOut } from "~/server/utils/auth.server";

export async function action({ request }: DataFunctionArgs) {
  return await signOut(request, "/");
}

export async function loader({ request }: DataFunctionArgs) {
  return redirect("/");
}

export default {};
