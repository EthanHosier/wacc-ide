"use client";

import React, { useEffect, useRef, useState } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import * as monaco_editor from "monaco-editor";
import { editor } from "monaco-editor";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import {
  languageConfiguration,
  waccCompletionItemProvider,
  waccSyntaxRules,
} from "@/wacc-syntax-rules";
import {
  DEFAULT_FILE_CONTENTS,
  getFileFromLocalStorage,
  storeRecordInLocalStorage,
} from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface MonacoEditorProps {
  fileName: string;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({ fileName }) => {
  const monaco = useMonaco();
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const savedFileContents = getFileFromLocalStorage(fileName);

  useEffect(() => {
    if (!monaco) return;
    // Register the WACC language
    monaco.languages.register({ id: "wacc" });
    // Define the language configuration
    monaco.languages.setMonarchTokensProvider("wacc", waccSyntaxRules);
    monaco.languages.registerCompletionItemProvider(
      "wacc",
      waccCompletionItemProvider
    );
    monaco.languages.setLanguageConfiguration("wacc", languageConfiguration);

    return () => {
      // Cleanup: clear any existing timeout when the component is unmounted
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
    };
  }, [monaco]);

  const handleEditorChange = (value: string | undefined, event: any) => {
    if (!value) return;

    // Clear existing timeout if any
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    // Set a new timeout to save the file after 2 seconds of inactivity7
    saveTimeout.current = setTimeout(() => {
      storeRecordInLocalStorage(fileName, value);
    }, 300);
  };

  return (
    <>
      {!savedFileContents ? (
        <div className="p-4">Error: File not found</div>
      ) : (
        <Editor
          height="100%"
          width="full"
          defaultLanguage="wacc" // Set the default language to "wacc"
          defaultValue={savedFileContents ?? DEFAULT_FILE_CONTENTS}
          options={{ selectOnLineNumbers: true }}
          // onMount={handleEditorDidMount}
          theme="wacc-theme"
          loading={<Loader2 className="animate-spin" />}
          onChange={handleEditorChange}
        />
      )}
    </>
  );
};

export default MonacoEditor;
