import type { SerializeFrom } from "@remix-run/node";
import {
  Form,
  Link,
  NavLink,
  useFetcher,
  useRouteLoaderData,
} from "@remix-run/react";
import { useState } from "react";
import { type loader as rootLoader } from "~/root";
import type { IOrder } from "~/server/models/OrdersModel";
import { useOptionalUser } from "~/utils/misc";
import Button from "../custom-ui/Button";
import CartButton from "../custom-ui/CartButton";

type Props = {};

// const userDialog = (
//   <Popover>
//     <Popover.Body className="name-tag">
//       <Link to="/checkout">Check Out</Link>
//       <Link to="/account-information">Account Information</Link>
//       <Link to="/account-information">Order History</Link>
//       <Link to="/">Sign Out</Link>
//     </Popover.Body>
//   </Popover>
// );

const Header = () => {
  const user = useOptionalUser();
  const [showUserNMenu, setShowUserMenu] = useState(false);
  const rootData = useRouteLoaderData("root") as SerializeFrom<
    typeof rootLoader
  >;
  const ORDERS = rootData.USER_ORDERS as IOrder[];
  const fetcher = useFetcher();
  const cartCount = ORDERS.length ?? 0;

  return (
    <nav className="py-4 w-full container flex flex-row flex-nowrap justify-between items-center">
      <NavLink to="/" className="decoration-0 no-underline">
        Doolittle
      </NavLink>

      <div className="flex gap-3 items-center">
        <NavLink to="/cart" className={"no-underline"}>
          <CartButton itemsInCart={cartCount} />
        </NavLink>
        {!user ? (
          <>
            <div className="flex gap-2">
              <NavLink to="/access?r=login">
                <Button>
                  <div className="flex">
                    <span className="text-base">Log In</span>
                  </div>
                </Button>
              </NavLink>

              <NavLink to="/access?r=register">
                <Button>
                  <div className="flex">
                    <span className="text-base">Sign Up</span>
                  </div>
                </Button>
              </NavLink>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <div
              className="relative"
              onMouseEnter={() => setShowUserMenu(true)}
              onMouseLeave={() => setShowUserMenu(false)}
            >
              <img
                src={"/user/placeholder.jpg"}
                alt={"user"}
                className="w-8 h-8 rounded-full object-cover object-center"
              />

              {showUserNMenu && (
                <div className="absolute right-0 flex gap-3 w-48 flex-col  bg-white text-right text-sm">
                  <nav>
                    <Link
                      to={`u/#`}
                      className="cursor-pointer capitalize text-black hover:text-gray-400"
                    >
                      {user.fullName}
                    </Link>
                    <hr />
                    <Link to={`u/#`} className="text-black">
                      Track your Orders
                    </Link>
                    <hr />
                    <Form action="/logout" method="post">
                      <button
                        type="submit"
                        className="cursor-pointer text-black hover:text-slate-800"
                      >
                        Sign Out
                      </button>
                    </Form>
                  </nav>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
