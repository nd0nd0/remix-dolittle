import { Form, Link } from "@remix-run/react";
import React from "react";
import Button from "~/components/custom-ui/Button";
import { Field } from "~/components/forms/Field";
import { useUser } from "~/utils/misc";

type Props = {};

const CheckoutConfirmOrder = (props: Props) => {
  const user = useUser();
  return (
    <div>
      <div className="flex flex-col">
        <h6 className="text-lg"> Order Details</h6>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between">
          <p>Shipping Address</p>

          <div className="flex p-2  items-center w-3/5 justify-between">
            <div>
              <div className="flex gap-4 p-2">
                <div>📌{user.shippingAddress}</div>
                <Button as="basic" className="underline">
                  <Link to={"/checkout/address"}>Change?</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <p>Phone Number</p>

          <div className="p-2 items-center justify-between w-3/5 ">
            <div className="flex gap-4 p-2">
              <div>✅{user.phoneNumber}</div>

              <Button as="basic" className="underline">
                <Link to={"/checkout/payment"}>Change?</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-8">
        <div className="items-center flex justify-between">
          <p>Payment Method</p>

          <div className="p-2 items-center justify-between w-3/5 flex">
            <div className="flex gap-4 p-2">
              <div>💰{user.paymentMethod}</div>

              <Button as="basic" className="underline">
                <Link to={"/checkout/payment"}>Change?</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Form>
          <Field
            type="textarea"
            className="min-h-[120px] p-2 bg-slate-400 text-black"
            name="extraInformation"
            placeholder="Add any extra information to help us deliver to you "
            label="(optional) Extra Order Information"
          />
        </Form>
      </div>
    </div>
  );
};

export default CheckoutConfirmOrder;
