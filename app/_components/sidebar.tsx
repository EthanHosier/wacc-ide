"use client";

import React, { useEffect, useState } from "react";
import SideBarItem, { type SideBarItem as sbt } from "./sidebar-item";
import {
  LOCAL_STORAGE_CHANGE_EVENT,
  getAllFilenamesFromLocalStorage,
} from "@/lib/utils";

const SideBar = () => {
  const [data, setData] = useState<sbt | null>(null);

  useEffect(() => {
    const handleStorageChange = () => {
      const newData: sbt = {
        name: "Wacc-IDE",
        children: getAllFilenamesFromLocalStorage().map((filename) => ({
          name: filename,
        })),
      };
      setData(newData);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(LOCAL_STORAGE_CHANGE_EVENT, handleStorageChange);

    handleStorageChange();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        LOCAL_STORAGE_CHANGE_EVENT,
        handleStorageChange
      );
    };
  }, []);

  return <div className="">{data && <SideBarItem item={data} />}</div>;
};

export default SideBar;
