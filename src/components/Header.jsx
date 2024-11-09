import React from 'react';
import { Globe2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const Header = () => {
  return (
    <div className="flex justify-between items-center mb-12">
      <h1 className="font-display text-5xl font-bold">
        Equi<span className="text-primary">fy</span>
      </h1>
      <div className="flex gap-4 items-center">
        <Select defaultValue="en">
          <SelectTrigger className="w-40 bg-zinc-900 border-zinc-800 rounded-xl p-2">
            <Globe2 className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Español</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
            <SelectItem value="de">Deutsch</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Header;
