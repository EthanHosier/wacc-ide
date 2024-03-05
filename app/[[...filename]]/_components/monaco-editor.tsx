"use client";

import React, { useEffect, useRef, useState } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";

import { editor } from "monaco-editor";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import {
  languageConfiguration,
  waccCompletionItemProvider,
  waccSyntaxRules,
} from "@/wacc-syntax-rules";
import {
  DEFAULT_FILE_CONTENTS,
  extractSemanticErrorInformation,
  extractSyntaxErrorInformation,
  getFileFromLocalStorage,
  storeRecordInLocalStorage,
} from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ideStore } from "@/app/store/ide";

interface MonacoEditorProps {
  fileName: string;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({ fileName }) => {
  const monaco = useMonaco();
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const savedFileContents = getFileFromLocalStorage(fileName);
  const store = ideStore((state: any) => state);

  const [editor, setEditor] = useState<editor.IStandaloneCodeEditor | null>(
    null
  );

  useEffect(() => {
    if (!monaco) return;

    // Register the WACC language
    monaco.languages.register({ id: "wacc" });
    // Define the language configuration
    monaco.languages.setMonarchTokensProvider("wacc", waccSyntaxRules);
    const { dispose } = monaco.languages.registerCompletionItemProvider(
      "wacc",
      waccCompletionItemProvider
    );
    monaco.languages.setLanguageConfiguration("wacc", languageConfiguration);

    return () => {
      // Cleanup: clear any existing timeout when the component is unmounted
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
      dispose();
    };
  }, [monaco]);

  useEffect(() => {
    if (!monaco || !store.error || !editor) return;

    let errorInfo = extractSyntaxErrorInformation(store.error);
    if (!errorInfo) {
      errorInfo = extractSemanticErrorInformation(
        store.error,
        editor.getValue()!
      );
      if (!errorInfo) return;
    }
    console.log({ errorInfo });
    const errorMarker = {
      severity: monaco.MarkerSeverity.Error,
      message: errorInfo.errorText,
      startLineNumber: errorInfo.lineNumber,
      startColumn: errorInfo.columnNumber,
      endLineNumber: errorInfo.lineNumber,
      endColumn:
        (errorInfo.endColNumber
          ? errorInfo.endColNumber
          : errorInfo.columnNumber) + 1,
    };
    monaco.editor.setModelMarkers(editor.getModel()!, "your-marker-key", [
      errorMarker,
    ]);
  }, [store.error]);

  const handleEditorChange = (value: string | undefined, event: any) => {
    if (monaco && editor) {
      monaco.editor.setModelMarkers(editor.getModel()!, "your-marker-key", []);
    }

    if (!value) return;

    // Clear existing timeout if any
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    // Set a new timeout to save the file after 300 ms of inactivity
    saveTimeout.current = setTimeout(() => {
      storeRecordInLocalStorage(fileName, value);
    }, 300);
  };

  return (
    <>
      {!savedFileContents ? (
        <div className="p-4">{fileName && `Error: ${fileName} not found`}</div>
      ) : (
        <Editor
          onMount={(editor, monaco) => setEditor(editor)}
          height="100%"
          width="full"
          defaultLanguage="wacc" // Set the default language to "wacc"
          defaultValue={savedFileContents ?? DEFAULT_FILE_CONTENTS}
          options={{
            selectOnLineNumbers: true,
            matchBrackets: "always",
            tabSize: 2,
          }}
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
