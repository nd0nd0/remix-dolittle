import { Form, useActionData, useFetcher, useNavigate } from "@remix-run/react";
import Button from "~/components/custom-ui/Button";
import { Field } from "~/components/forms/Field";
import { useUser } from "~/utils/misc";
import * as Z from "zod";
import type { DataFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { requireMiniUserAuth } from "~/server/utils/auth.server";
import { preprocessFormData } from "~/server/utils/validation";
import {
  ADD_PAYMENT_DETAILS_USER,
  CLEAR_PAYMENT_METHOD_USER,
  CLEAR_PHONE_NUMBER_USER,
} from "~/server/services/user.service.server";
import { useState } from "react";
type Props = {};
const phoneRegex =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const paymentDetailsSchema = Z.object({
  paymentMethod: Z.string({ required_error: "This is a required field" }),
  phoneNumber: Z.string({ required_error: "This is a required field" })
    .min(8, "Phone number is too short")
    .max(13, "Phone number is too long"),
  // .regex(phoneRegex, { message: "Must be a phone number" }), //TODO: Phone number regex
});

export async function action({ request }: DataFunctionArgs) {
  const formData = await request.clone().formData();
  const _action = formData.get("_action");
  const userID = await requireMiniUserAuth(request);
  if (userID && _action === "_add_payment_phonenumber") {
    const paymentDetailsFormData = paymentDetailsSchema.safeParse(
      preprocessFormData(formData, paymentDetailsSchema)
    );
    if (!paymentDetailsFormData.success) {
      return json(
        { errors: paymentDetailsFormData.error.flatten() },
        { status: 400 }
      );
    }

    const { paymentMethod, phoneNumber } = paymentDetailsFormData.data;
    const addpaymentDetails = await ADD_PAYMENT_DETAILS_USER(
      userID,
      paymentMethod,
      phoneNumber
    );
    if (!addpaymentDetails) {
      return json(
        {
          errors: {
            fieldErrors: {
              phoneNumber: [
                "Something went wrong while creating/updating this field",
              ],
              paymentMethod: [
                "Something went wrong while creating/updating this field",
              ],
            },
          },
        },
        {
          status: 400,
        }
      );
    }

    return redirect("/checkout/confirmorder");
  }
  if (userID && _action === "_clear-payment-method") {
    const clearPaymentMethod = await CLEAR_PAYMENT_METHOD_USER(userID);
    if (!clearPaymentMethod) {
      return json(
        {
          errors: {
            fieldErrors: {
              phoneNumber: [],
              paymentMethod: [
                "Something went wrong while creating/updating this field",
              ],
            },
          },
        },
        {
          status: 400,
        }
      );
    }

    return json(
      {
        errors: {
          fieldErrors: {
            paymentMethod: ["Add Payment Method before you Proceed"],
            phoneNumber: [],
          },
        },
      },
      {
        status: 400,
      }
    );
  }
  if (userID && _action === "_clear-phone-number") {
    const clearPhoneNumber = await CLEAR_PHONE_NUMBER_USER(userID);
    if (!clearPhoneNumber) {
      return json(
        {
          errors: {
            fieldErrors: {
              phoneNumber: [
                "Something went wrong while creating/updating this field",
              ],
              paymentMethod: [],
            },
          },
        },
        {
          status: 400,
        }
      );
    }

    return json(
      {
        errors: {
          fieldErrors: {
            paymentMethod: [],
            phoneNumber: ["Add Payment Method before you Proceed"],
          },
        },
      },
      {
        status: 400,
      }
    );
  }

  return redirect("/checkout");
}
const CheckoutPayment = (props: Props) => {
  const user = useUser();
  const actionData = useActionData();
  const payMethods = [
    { id: 1, label: "Airtel Money", img: "/public/external-logos/Airtel.png" },
    { id: 2, label: "MTN Money", img: "/public/external-logos/mtnmoney.png" },
    {
      id: 3,
      label: "Cash on Delivery",
      img: "/public/external-logos/cash-on-delivery.png",
    },
  ];

  return (
    <div>
      <div className="flex flex-col">
        <h6 className="text-lg">Choose Payment Method</h6>
      </div>

      <div>
        <Form method="POST">
          <div className="flex items-center mb-4 ">
            <div className="w-2/5">Payment Method</div>
            <div>
              {user.paymentMethod && user.paymentMethod !== "" ? (
                <div className="flex gap-4 p-2">
                  <div>💰{user.paymentMethod}</div>
                  <input
                    defaultValue={user.paymentMethod}
                    name="paymentMethod"
                    hidden
                  />

                  <Button
                    as="basic"
                    className="underline"
                    name="_action"
                    type="submit"
                    value="_clear-payment-method"
                  >
                    Change?
                  </Button>
                </div>
              ) : (
                <select
                  id="payment"
                  name="paymentMethod"
                  className={`p-2 bg-white ${
                    actionData?.errors?.fieldErrors?.paymentMethod[0]
                      ? "text-red-500 border-red-500 outline"
                      : "text-black"
                  }  rounded-sm`} // onChange={(e) => setPayMethod(e.target.value)}
                >
                  <option
                    label={
                      user.paymentMethod === "" || !user.paymentMethod
                        ? "Choose a Payment Method"
                        : user.paymentMethod
                    }
                    // value={user.paymentMethod === "" ? null : user.paymentMethod}
                    selected
                    disabled
                    hidden={true}
                  />
                  {payMethods.map((choice) => {
                    return (
                      <option
                        value={choice.label}
                        label={choice.label}
                        key={choice.id}
                      >
                        {choice.label}
                      </option>
                    );
                  })}
                </select>
              )}
            </div>
          </div>
          <div className="flex items-center mb-4">
            <div className="w-2/5">Phone Number</div>
            {user.phoneNumber && user.phoneNumber !== "" ? (
              <div className="flex gap-4 p-2">
                <div>✅{user.phoneNumber}</div>
                <input
                  defaultValue={user.phoneNumber}
                  name="phoneNumber"
                  hidden
                />
                <Button
                  as="basic"
                  className="underline"
                  name="_action"
                  type="submit"
                  value="_clear-phone-number"
                >
                  Change?
                </Button>
              </div>
            ) : (
              <div>
                <Field
                  name="phoneNumber"
                  className={`p-2 bg-white rounded-sm ${
                    actionData?.errors?.fieldErrors?.phoneNumber[0]
                      ? "text-red-500 border-red-500 outline outline-red-500"
                      : "text-black"
                  } `}
                  placeholder={
                    user.phoneNumber === "" || !user.phoneNumber
                      ? "+256702123456"
                      : user.phoneNumber
                  }
                  type="tel"
                  error={actionData?.errors?.fieldErrors?.phoneNumber[0]}
                  // leftAddon="+256"
                ></Field>
              </div>
            )}
          </div>
          <Button type="submit" name="_action" value="_add_payment_phonenumber">
            Proceed to checkout
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default CheckoutPayment;
