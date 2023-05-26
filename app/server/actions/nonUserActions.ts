import { v4 as uuidv4 } from "uuid";

export const generateUUID = async () => {
  if (typeof window !== "undefined") {
    console.log("called ✅");
    window.localStorage.setItem("NX-UUID", uuidv4());
  }

  console.log("called 😢");
  return null;
};

export const deleteUUID = () => async () => {
  return localStorage.removeItem("NX-UUID");
};

export const getUUID = () => {
  const currentUUID = localStorage.getItem("NX-UUID");
  if (currentUUID) {
    return currentUUID;
  } else {
    generateUUID();
  }
};
