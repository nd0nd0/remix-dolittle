import { Link, NavLink, useRouteLoaderData } from "@remix-run/react";
import CartButton from "../custom-ui/CartButton";
import Button from "../custom-ui/Button";
import { type loader as rootLoader } from "~/root";
import type { SerializeFrom } from "@remix-run/node";

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

const Header = (props: Props) => {
  const { USER_ORDERS } = useRouteLoaderData("root") as SerializeFrom<
    typeof rootLoader
  >;
  const cartCount = USER_ORDERS?.length ?? 0;
  return (
    <nav className="py-4 w-full container flex flex-row flex-nowrap justify-between items-center">
      <NavLink to="/" className="decoration-0 no-underline">
        Doolittle
      </NavLink>

      <div className="flex gap-3 items-center">
        <NavLink to="/cart" className={"no-underline"}>
          <CartButton itemsInCart={cartCount} />
        </NavLink>
        {/* {!userAuth ? (
          <>
            <Nav style={{ marginRight: "10px" }}>
              <NavLink to="/signin">
                <Button className="btnFocus" size="small" variant="primary">
                  <div style={{ display: "flex" }}>
                    <span style={{ fontSize: "16px" }}>Sign In</span>
                  </div>
                </Button>
              </NavLink>
            </Nav>
            <Nav>
              <NavLink to="/signup">
                <Button className="btnFocus" size="small" variant="primary">
                  <div style={{ display: "flex" }}>
                    <span style={{ fontSize: "16px" }}>Sign Up</span>
                  </div>
                </Button>
              </NavLink>
            </Nav>
          </>
        ) : (
          <>
            <Nav>
              
                <OverlayTrigger
                  trigger="click"
                  placement="bottom"
                  overlay={userDialog}
                >
                  <Button>
                    <div style={{ display: "flex" }}>
                      <span
                        style={{
                          fontSize: "16px",
                          textTransform: "capitalize",
                        }}
                      >
                        Hello {userDetails.fullName}
                      </span>
                    </div>
                  </Button>
                </OverlayTrigger>
             
            </Nav>
          </>
        )} */}
        <div className="flex gap-2">
          <NavLink to="/signin">
            <Button>
              <div className="flex">
                <span className="text-base">Sign In</span>
              </div>
            </Button>
          </NavLink>

          <NavLink to="/signup">
            <Button>
              <div className="flex">
                <span className="text-base">Sign Up</span>
              </div>
            </Button>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Header;
