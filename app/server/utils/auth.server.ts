import { redirect } from "@remix-run/node";
import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { GoogleStrategy, SocialsProvider } from "remix-auth-socials";
import invariant from "tiny-invariant";
import {
  GET_USER_BY_EMAIL,
  GET_USER_BY_ID,
  GOOGLE_STRATEGY_CREATE_USER,
  VERIFY_LOGIN,
} from "../services/user.service.server";
import {
  commitSession,
  destroySession,
  getSession,
  sessionStorage,
} from "./session.server";

export async function requireMiniUserAuth(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    return null;
  }

  return userId;
}
export async function getNonUserUUID(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const UUID = session.get("NX_UUID");
  if (!UUID || typeof UUID !== "string") {
    return null;
  }

  return UUID;
}
export async function deleteNonUserUUID(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  return session.unset("NX_UUID");
}

//user

export const authenticator = new Authenticator<string>(sessionStorage, {
  sessionKey: process.env.SESSION_SECRET,
});

const getCallback = (provider: SocialsProvider) => {
  return `http://localhost:3000/auth/${provider}/callback`;
};

//Login Strategy

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email");
    const password = form.get("password");
    invariant(typeof email === "string", "email must be a string"); //use zod
    invariant(email.length > 0, "email must not be empty"); // use zod

    invariant(typeof password === "string", "password must be a string"); // use zod
    invariant(password.length > 0, "password must not be empty"); // use zod

    const user = await VERIFY_LOGIN(email, password);

    if (!user) {
      throw Error("Invalid Email or Password!");
    }

    const stringifiedUserID = JSON.stringify(user._id);

    return stringifiedUserID;
  }),
  FormStrategy.name
);

authenticator.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: getCallback(SocialsProvider.GOOGLE),
    },
    async ({ profile }) => {
      const email = profile.emails[0].value;
      const name =
        profile.name.familyName +
        profile.name.givenName +
        profile.name.middleName;
      // const image = profile.photos[0].value;
      // const user = await verifyLogin(profile.emails[0].value);

      const findUser = await GET_USER_BY_EMAIL(email);

      if (!findUser) {
        // create User
        const newUser = await GOOGLE_STRATEGY_CREATE_USER(email, name);

        if (!newUser) {
          throw Error("Account Creation Failed");
        }

        return newUser._id;
      }

      // here you would find or create a user in your database
      return findUser._id;
    }
  )
  // GoogleStrategy.name
);

export async function signOut(request: Request, redirectTo: string) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect(safeRedirect("/"), {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = "/"
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

export async function authenticateUser(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);

    throw redirect(safeRedirect(`/access/?${searchParams}?=login`));
  }

  const user = await GET_USER_BY_ID(userId);

  if (!user) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    signOut(request, redirectTo);
    throw redirect(safeRedirect(`/access/?${searchParams}?r=register`));
  }

  return user;
}

export async function createUserSession(
  user_id: string,
  redirectTo: string | undefined
) {
  let redir = redirectTo ? redirectTo : "/";
  const session = await getSession();
  session.set("userId", user_id);
  return redirect(safeRedirect(redir), {
    headers: {
      "Set-Cookie": await commitSession(session, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
      }),
    },
  });
}
