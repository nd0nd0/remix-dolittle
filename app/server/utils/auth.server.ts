import { getSession } from "./session.server";

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
