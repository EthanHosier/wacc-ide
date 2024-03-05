"use client";

import { ideStore } from "@/app/store/ide";
import React from "react";

const Input = () => {
  const store = ideStore((state: any) => state);
  return (
    <div className="flex flex-col h-full p-6 overflow-auto">
      <h1>
        <code className="font-semibold">Input</code>
      </h1>
      <textarea
        onChange={(e) => store.setInput(e.target.value)}
        className="w-full min-h-24 p-2 mt-2 border rounded-md"
        placeholder="Lorem ipsum..."
      />
    </div>
  );
};

export default Input;
