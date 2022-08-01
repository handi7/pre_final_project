import React from "react";
import MyNavbar from "./MyNavbar";
import { Outlet } from "react-router";

export default function WithNav() {
  return (
    <>
      <MyNavbar />
      <Outlet />
    </>
  );
}
