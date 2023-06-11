import { json, type DataFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useNavigate } from "@remix-run/react";
import * as Z from "zod";
import Button from "~/components/custom-ui/Button";
import { Field } from "~/components/forms/Field";
import {
  ADD_SHIPPING_ADDRESS_USER,
  CLEAR_SHIPPING_ADDRESS_USER,
} from "~/server/services/user.service.server";
import { requireMiniUserAuth } from "~/server/utils/auth.server";
import { preprocessFormData } from "~/server/utils/validation";
import { useUser } from "~/utils/misc";

export const shippingAddressSchema = Z.object({
  shippingAddress: Z.string()
    .nonempty({ message: "Shipping Address Cannot be empty " })
    .min(4),
});

export async function action({ request }: DataFunctionArgs) {
  const formData = await request.clone().formData();
  const _action = formData.get("_action");
  const userID = await requireMiniUserAuth(request);

  if (userID && _action === "_add-shipping-address") {
    const shippingAddressFormData = shippingAddressSchema.safeParse(
      preprocessFormData(formData, shippingAddressSchema)
    );
    if (!shippingAddressFormData.success) {
      return json(
        { errors: shippingAddressFormData.error.flatten() },
        { status: 400 }
      );
    }

    const { shippingAddress } = shippingAddressFormData.data;
    const addShippingAddress = await ADD_SHIPPING_ADDRESS_USER(
      userID,
      shippingAddress
    );
    if (!addShippingAddress) {
      return json(
        {
          errors: {
            fieldErrors: {
              shippingAddress: [
                "Something went wrong while creating your account",
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
        errors: null,
        shippingAddress: addShippingAddress,
      },
      {
        status: 200,
      }
    );
  }
  if (userID && _action === "_clear-shipping-address") {
    console.log("Iam here ➡️");

    const clearShippingAddress = await CLEAR_SHIPPING_ADDRESS_USER(userID);
    if (!clearShippingAddress) {
      return json(
        {
          errors: {
            fieldErrors: {
              shippingAddress: [
                "Something went wrong while creating your account",
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
        errors: null,
        shippingAddress: null,
      },
      {
        status: 200,
      }
    );
  }

  return null;
}
const CheckoutAddress = () => {
  const actionData = useActionData();
  const navigate = useNavigate();
  const user = useUser();
  return (
    <div>
      <div>
        <Form className="flex gap-4" method="POST">
          <div className="flex flex-row gap-3 items-end mb-3">
            <div>
              <Field
                type="text"
                name="shippingAddress"
                label="Shipping Address"
                className="p-2 bg-white text-black rounded-sm "
                placeholder="Najjera 2 Mbogo 1 Road"
                error={actionData?.errors?.fieldErrors?.shippingAddress[0]}
                //TODO: Implement Google search
              />
            </div>
            <div>
              <Button
                type="submit"
                name="_action"
                value="_add-shipping-address"
                className="disabled:cursor-not-allowed disabled:opacity-50"
                disabled={user.shippingAddress ? true : false}
              >
                Add New Address
              </Button>
            </div>
          </div>
        </Form>
        {user.shippingAddress ? (
          <Form method="POST">
            <div className=" w-1/2">
              <div className="flex gap-4 p-2">
                <div>✅{user.shippingAddress}</div>
                <Button
                  as="basic"
                  className="underline"
                  name="_action"
                  type="submit"
                  value="_clear-shipping-address"
                >
                  Delete?
                </Button>
              </div>
            </div>
          </Form>
        ) : null}
      </div>
      <Button
        disabled={!user.shippingAddress}
        className="mt-4 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => navigate("/checkout")}
      >
        Proceed to checkbox
      </Button>
    </div>
  );
};

export default CheckoutAddress;
