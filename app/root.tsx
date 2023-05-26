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
  useRouteError,
} from "@remix-run/react";
import { v4 as uuidv4 } from "uuid";
import type { IOrder } from "./server/models/OrdersModel";
import { GET_NON_USER_ORDERS } from "./server/services/nonuser.server";
import { GET_USER_BY_ID } from "./server/services/user.server";
import {
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

export async function loader({ request }: DataFunctionArgs): Promise<
  TypedResponse<{
    user: null;
    ENV: {
      MODE: "development" | "production" | "test";
    };
    USER_ORDERS: IOrder[] | null;
  }>
> {
  const userID = await requireMiniUserAuth(request);
  let user: Awaited<ReturnType<typeof GET_USER_BY_ID>> | null = null;
  let USER_ORDERS: Awaited<ReturnType<typeof GET_NON_USER_ORDERS>> | null =
    null;
  if (userID) {
    user = await GET_USER_BY_ID(userID);
    const session = await getSession(request.headers.get("Cookie"));

    if (!user) {
      const nonUserUUID = await getNonUserUUID(request);
      if (nonUserUUID) {
        USER_ORDERS = await GET_NON_USER_ORDERS(nonUserUUID);
        return json({
          user: null,
          ENV: getEnv(),
          USER_ORDERS,
        });
      } else {
        const session = await getSession();
        session.set("NX_UUID", uuidv4());
        return json(
          {
            user: null,
            USER_ORDERS,
            ENV: getEnv(),
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
    } else {
      // const user = GET_USER_BY_ID(userID);
      return json(
        {
          user: null,
          ENV: getEnv(),
          USER_ORDERS,
        },
        {
          headers: {
            "Set-Cookie": await destroySession(session),
          },
        }
      );
    }
  } else {
    const nonUserUUID = await getNonUserUUID(request);
    if (nonUserUUID) {
      USER_ORDERS = await GET_NON_USER_ORDERS(nonUserUUID);
      return json({
        user: null,
        ENV: getEnv(),
        USER_ORDERS,
      });
    } else {
      const session = await getSession();
      const UUIDV4 = uuidv4();
      session.set("NX_UUID", UUIDV4);
      return json(
        { user: null, ENV: getEnv(), USER_ORDERS },
        {
          headers: {
            "Set-Cookie": await commitSession(session, {
              maxAge: 60 * 60 * 24 * 7, // 7 days
            }),
          },
        }
      );
    }
  }
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
  title = "Doolittle Kids Clothing",
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
