import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Info, Bookmark, Menu } from "lucide-react";
import { useBuild } from "@/lib/hooks/use-build";
import { BuildSummary } from "@/components/build-summary";
import { SavedBuilds } from "@/components/saved-builds";

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const [showBuildSummary, setShowBuildSummary] = useState(false);
  const [showSavedBuilds, setShowSavedBuilds] = useState(false);
  const { build } = useBuild();

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="ml-2 text-xl font-bold text-gray-900">TinyWhoop Builder</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <Button 
                variant="default" 
                size="sm" 
                className="inline-flex items-center"
                onClick={() => setShowBuildSummary(true)}
              >
                <Info className="mr-2 -ml-0.5 h-4 w-4" />
                Current Build
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-4 inline-flex items-center"
                onClick={() => setShowSavedBuilds(true)}
              >
                <Bookmark className="mr-2 -ml-0.5 h-4 w-4" />
                Saved Builds
              </Button>
              
              <div className="ml-4 flex items-center md:hidden">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleSidebar}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <BuildSummary 
        open={showBuildSummary}
        onOpenChange={setShowBuildSummary}
      />
      
      <SavedBuilds
        open={showSavedBuilds}
        onOpenChange={setShowSavedBuilds}
      />
    </>
  );
}
