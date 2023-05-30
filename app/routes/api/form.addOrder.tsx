import rootLoader from "~/root";
export async function action() {
  console.log("you called me");
  return null;
}

export async function loader() {
  console.log("you called me 🪴");
  return null;
}
