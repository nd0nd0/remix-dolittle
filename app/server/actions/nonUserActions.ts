import { v4 as uuidv4 } from "uuid";

export function generateUUID() {
  return localStorage.setItem("NX-UUID", uuidv4());
}

export function deleteUUID() {
  return localStorage.removeItem("NX-UUID");
}

export function getUUID() {
  const currentUUID = localStorage.getItem("NX-UUID");
  if (!currentUUID) {
    return localStorage.setItem("NX-UUID", uuidv4());
  }
  return currentUUID;
}
