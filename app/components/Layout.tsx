import React from "react";
import Header from "./ui/Header";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <main>
      <Header />
      <div>{children}</div>
    </main>
  );
};

export default Layout;
