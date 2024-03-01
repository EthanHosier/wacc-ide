"use client";

import {
  DEFAULT_FILE_CONTENTS,
  cn,
  storeRecordInLocalStorage,
} from "@/lib/utils";
import { ChevronDown, ChevronUp, FilePlus, Plus } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
export type SideBarItem = {
  name: string;
  children?: SideBarItem[];
};

const SideBarItem = ({ item }: { item: SideBarItem }) => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filename, setFilename] = useState<string>("");

  const onClick = () => {
    if (item.children) {
      setIsOpen(!isOpen);
      return;
    }
    router.push(`/${item.name}`);
  };

  const onSubmit = () => {
    storeRecordInLocalStorage(filename, DEFAULT_FILE_CONTENTS);
    // create a file
    router.push(`/${filename}`);
  };

  return (
    <div>
      <div className="flex-1 flex">
        <div className="flex mb-1">
          {item.children && (isOpen ? <ChevronDown /> : <ChevronUp />)}
          <span
            className={cn("hover:cursor-pointer", {
              "font-semibold": item.children,
            })}
            onClick={onClick}
          >
            {item.name}
          </span>
        </div>
        {item.children && (
          <div className="flex-1 flex justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <FilePlus className="text-gray-500 cursor-pointer" />
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Create a new .wacc file</AlertDialogTitle>
                  <AlertDialogDescription className="flex flex-col">
                    <Label htmlFor="filename" className="mb-2">
                      File name
                    </Label>
                    <Input
                      type="text"
                      placeholder="file.wacc"
                      required
                      id="filename"
                      onChange={(e) => setFilename(e.target.value)}
                    />
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button type="submit" onClick={onSubmit}>
                      Submit
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="ml-8">
          {item.children?.map((child) => (
            <SideBarItem item={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SideBarItem;