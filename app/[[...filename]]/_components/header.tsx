import { Button } from "@/components/ui/button";
import { Play, Save } from "lucide-react";
import React from "react";

interface HeaderProps {
  filename: string;
}

const Header: React.FC<HeaderProps> = ({ filename }) => {
  return (
    <div className="flex-1 flex bg-muted">
      <div className="h-full bg-white rounded-t-lg border-t border-r p-2">
        {filename}.wacc
      </div>
      <div className="flex-1 flex justify-end pr-8 items-center">
        <Button variant={"ghost"}>
          <Play className="text-green-800" />
        </Button>
      </div>
    </div>
  );
};

export default Header;
