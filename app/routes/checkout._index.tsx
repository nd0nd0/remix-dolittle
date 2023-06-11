import type { DataFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import React from "react";
import { authenticateUser } from "~/server/utils/auth.server";

type Props = {};

export async function loader({ request }: DataFunctionArgs) {
  const user = await authenticateUser(request);
  console.log("🚀 ~ file: checkout._index.tsx:10 ~ loader ~ user:", user);

  if (!user?.shippingAddress || user?.shippingAddress?.length === 0) {
    return redirect("address");
  } else if (!user?.paymentMethod || user?.paymentMethod?.length === 0) {
    return redirect("payment");
  }

  return null;
}
