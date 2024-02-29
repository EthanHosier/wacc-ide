"use client";

import React from "react";
import SideBarItem, { type SideBarItem as sbt } from "./sidebar-item";
import { getAllFilenamesFromLocalStorage } from "@/lib/utils";

const data: sbt = {
  name: "Wacc-IDE",
  children: getAllFilenamesFromLocalStorage().map((filename) => ({
    name: filename,
  })),
};

console.log({ filenames: getAllFilenamesFromLocalStorage() });

const SideBar = () => {
  return (
    <div className="">
      <SideBarItem item={data} />
    </div>
  );
};

export default SideBar;
