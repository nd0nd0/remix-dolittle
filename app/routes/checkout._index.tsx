import type { DataFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import React from "react";
import { authenticateUser } from "~/server/utils/auth.server";

type Props = {};

export async function loader({ request }: DataFunctionArgs) {
  const user = await authenticateUser(request);

  if (user) {
    if (!user.shippingAddress || user.shippingAddress === "") {
      return redirect("address");
    } else if (!user.paymentMethod || user.paymentMethod === "") {
      return redirect("payment");
    }
  }

  return redirect("confirmorder");
}
