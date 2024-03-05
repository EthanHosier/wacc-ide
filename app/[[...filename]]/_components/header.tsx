"use client";

import { ideStore } from "@/app/store/ide";
import { Button } from "@/components/ui/button";
import { getFileFromLocalStorage } from "@/lib/utils";
import { Loader, Loader2, Play, Save } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

interface HeaderProps {
  filename: string;
}

const Header: React.FC<HeaderProps> = ({ filename }) => {
  const [loading, setIsLoading] = useState(false);
  const store = ideStore((state: any) => state);

  const pathname = usePathname();

  const onClick = async () => {
    setIsLoading(true);

    try {
      const fileName = pathname.replace("/", "");

      const fileContents = getFileFromLocalStorage(fileName);

      if (!fileContents) return;
      store.reset();
      store.setOutput("Compiling...");

      const res = await fetch("/api/compile", {
        method: "POST",
        body: JSON.stringify({
          fileContents,
          input: store.input?.split("\n") ?? [],
        }),
      });

      const data = await res.json();

      if (data.error) {
        store.setError(data.output);
      } else {
        store.setError("");
        store.setOutput(data.output);
      }

      store.setExitCode(data.compilerStatus);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex bg-muted">
      {filename && (
        <div className="h-full bg-white rounded-t-lg border-t border-r p-2">
          <code> {filename}</code>
        </div>
      )}

      <div className="flex-1 flex justify-end pr-8 items-center">
        <Button
          variant={"ghost"}
          type="button"
          onClick={onClick}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="animate-spin text-green-800" />
          ) : (
            <Play className="text-green-800" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default Header;
