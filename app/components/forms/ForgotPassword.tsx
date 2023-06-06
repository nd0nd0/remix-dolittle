import { useFetcher } from "@remix-run/react";
import React from "react";
const ForgetPassword = () => {
  const fetcher = useFetcher();
  return (
    <div>
      <fetcher.Form method="post">
        <div>
          <label>New Password</label>
          <input name="password" />
        </div>
      </fetcher.Form>
    </div>
  );
};

export default ForgetPassword;
