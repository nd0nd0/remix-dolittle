import type {
  DataFunctionArgs,
  LinksFunction,
  TypedResponse,
  V2_MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { v4 as uuidv4 } from "uuid";
import type { IOrder } from "./server/models/OrdersModel";
import type { GET_NON_USER_ORDERS } from "./server/services/nonuser.server";
import {
  GET_USER_BY_ID,
  GET_USER_ORDERS,
  VERIFY_LOGIN,
} from "./server/services/user.service.server";
import {
  deleteNonUserUUID,
  getNonUserUUID,
  requireMiniUserAuth,
} from "./server/utils/auth.server";
import { getEnv } from "./server/utils/env.serve";
import {
  commitSession,
  destroySession,
  getSession,
} from "./server/utils/session.server";

//-----styles-----//
import skeletonCss from "~/styles/skeleton.css";
import stylesheet from "~/styles/tailwind.css";
import type { IUser } from "./server/models/UserModel";
import {
  deleteUUID,
  generateUUID,
  getUUID,
} from "./server/actions/nonUserActions";
import { useEffect } from "react";

export async function loader({ request }: DataFunctionArgs): Promise<
  TypedResponse<{
    user: IUser | null;
    ENV: {
      MODE: "development" | "production" | "test";
    };
    USER_ORDERS: IOrder[] | [];
  }>
> {
  const userID = await requireMiniUserAuth(request);
  let user: Awaited<ReturnType<typeof GET_USER_BY_ID>> | null = null;
  let USER_ORDERS:
    | Awaited<ReturnType<typeof GET_NON_USER_ORDERS | typeof GET_USER_ORDERS>>
    | [] = [];
  const session = await getSession(request.headers.get("Cookie"));
  if (userID) {
    user = await GET_USER_BY_ID(userID);
    USER_ORDERS = await GET_USER_ORDERS(userID);
    return json(
      {
        user: user,
        ENV: getEnv(),
        USER_ORDERS,
      },
      {
        headers: {
          "Set-Cookie": await commitSession(session, {
            maxAge: 60 * 60 * 24 * 7, // 7 days
          }),
        },
      }
    );
  }
  return json(
    { user: null, ENV: getEnv(), USER_ORDERS: [] },
    {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    }
  );
}

export const meta: V2_MetaFunction = () => [
  {
    charset: "utf-8",
    viewport: "width=device-width, initial-scale=1",
  },
];

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "stylesheet", href: skeletonCss },
];

function Document({
  children,
  title = "Doolittle",
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <title>{title}</title>
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
export default function App() {
  const { user } = useLoaderData<typeof loader>();
  useEffect(() => {
    if (!user) {
      getUUID();
      const currentOrders = localStorage.getItem("NX-ORDERS");
      if (!currentOrders) {
        localStorage.setItem("NX-ORDERS", JSON.stringify([]));
      }
    }
    if (user) {
      deleteUUID();
    }
  }, [user]);
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary() {
  const caught = useRouteError();

  if (isRouteErrorResponse(caught)) {
    return (
      <Document title="Error!">
        <div className="container p-4">
          <h1 className="bg-blue-500">
            [ErrorBoundary]: There was an error:😢 ➡️
            {"✉️" + caught.error?.message + " " + caught.statusText}
          </h1>
        </div>
      </Document>
    );
  }
}
