"use client";

import dynamic from "next/dynamic";
import React, { ReactNode, useEffect, useState } from "react";

interface MonacoWrapperProps {
  filename: string;
}

const MonacoWrapper: React.FC<MonacoWrapperProps> = ({ filename }) => {
  const [MonacoEditor, setMonacoEditor] = useState<any>();

  useEffect(() => {
    const MonacoEditor = dynamic(() => import("./monaco-editor"), {
      ssr: false,
    });
    setMonacoEditor(() => <MonacoEditor fileName={filename} />);
  }, []);

  return MonacoEditor ?? <></>;
};

export default MonacoWrapper;
