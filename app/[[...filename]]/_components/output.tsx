"use client";

import React from "react";
import { ideStore } from "@/app/store/ide";
import { splitAtEndOfSentence } from "@/lib/utils";

const Output = () => {
  const store = ideStore((state: any) => state);
  return (
    <div className="flex flex-col h-full p-6 overflow-auto">
      <h1 className="font-semibold">
        <code>Output</code>
      </h1>

      {store.error ? (
        store.error.split("\n").map((e: string, i: number) => (
          <code className="text-red-500" key={i}>
            {e}
          </code>
        ))
      ) : (
        <code className="flex flex-col">
          {store.output.split("\n").map((e: string, i: number) => (
            <p key={i}>{e}</p>
          ))}
        </code>
      )}

      {store.exitCode != null && (
        <code className="text-sm text-muted-foreground mt-2">
          Exit code: {store.exitCode}
        </code>
      )}
    </div>
  );
};

export default Output;
