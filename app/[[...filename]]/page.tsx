import React from "react";
import MonacoWrapper from "./_components/monaco-wrapper";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Output from "./_components/output";
import Header from "./_components/header";
import Input from "./_components/input-section";
const Page = ({ params }: any) => {
  return (
    <div className="min-h-screen flex-1">
      <ResizablePanelGroup
        direction="vertical"
        className="min-h-screen w-screen"
      >
        <ResizablePanel defaultSize={60}>
          <Header filename={params.filename} />
          <div className="h-full">
            {<MonacoWrapper filename={params.filename} />}
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={20}>
          <Input />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={20}>
          <Output />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Page;
