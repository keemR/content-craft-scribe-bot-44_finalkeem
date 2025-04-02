
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="font-bold text-xl flex items-center">
            <span className="text-blue-600">Content</span>
            <span className="text-gray-800">Craft</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <SunIcon className="h-5 w-5" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button variant="outline" size="sm">Sign In</Button>
          <Button size="sm">Get Started</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
