"use client";

import {
  DEFAULT_FILE_CONTENTS,
  cn,
  deleteFileFromLocalStorage,
  ensureWaccExtension,
  storeRecordInLocalStorage,
} from "@/lib/utils";
import { ChevronDown, ChevronUp, FilePlus, Plus, Trash } from "lucide-react";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
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
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { toast } from "sonner";
const SideBarItem = ({ item }: { item: SideBarItem }) => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [filename, setFilename] = useState<string>("");

  const pathname = usePathname();

  const onClick = () => {
    if (item.children) {
      setIsOpen(!isOpen);
      return;
    }
    router.push(`/${item.name}`);
    ``;
  };

  const onSubmit = () => {
    const formattedFileName = ensureWaccExtension(filename);

    storeRecordInLocalStorage(formattedFileName, DEFAULT_FILE_CONTENTS);
    // create a file
    router.push(`/${formattedFileName}`);
    toast(`File Created`, {
      className: "m-4",
      description: `${formattedFileName} has been successfully created.`,
    });
  };

  const deleteItem = () => {
    deleteFileFromLocalStorage(item.name);
    toast(`File Deleted`, {
      className: "m-4",
      description: `${item.name} has been successfully deleted.`,
    });
    if (item.name === pathname.replace("/", "")) router.push("/");
  };

  return (
    <div>
      <div className="flex-1 flex">
        <div className="flex mb-1">
          {item.children && (isOpen ? <ChevronDown /> : <ChevronUp />)}
          <ContextMenu>
            <ContextMenuTrigger disabled={!!item.children}>
              <code
                className={cn("hover:cursor-pointer", {
                  "font-semibold": item.children,
                })}
                onClick={onClick}
              >
                {item.name}
              </code>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={deleteItem} className="text-red-500">
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
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
                    <Button
                      type="submit"
                      onClick={onSubmit}
                      disabled={!filename}
                    >
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
          {item.children?.map((child, i) => (
            <SideBarItem item={child} key={i} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SideBarItem;
