"use client";

import React from "react";
import { ideStore } from "@/app/store/ide";
import { splitAtEndOfSentence } from "@/lib/utils";

const Output = () => {
  const store = ideStore((state: any) => state);
  return (
    <div className="flex flex-col h-full p-6">
      <h1 className="font-semibold">Output</h1>

      {store.error ? (
        splitAtEndOfSentence(store.error).map((e) => (
          <div className="text-red-500">{e}</div>
        ))
      ) : (
        <div className="flex">{store.output}</div>
      )}

      {store.exitCode != null && (
        <div className="text-sm text-muted-foreground">
          Exit code: {store.exitCode}
        </div>
      )}
    </div>
  );
};

export default Output;
