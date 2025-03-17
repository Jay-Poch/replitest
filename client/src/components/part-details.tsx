import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Component } from "@shared/schema";
import { useBuild } from "@/lib/hooks/use-build";
import { Info } from "lucide-react";

interface PartDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  component: Component | null;
}

export function PartDetails({ open, onOpenChange, component }: PartDetailsProps) {
  const { addComponent } = useBuild();
  
  if (!component) {
    return null;
  }
  
  const handleAddToBuild = () => {
    addComponent(component.category, component);
    onOpenChange(false);
  };

  // Get compatibility notes based on component type
  const getCompatibilityNote = () => {
    switch (component.category) {
      case "drone":
        return "This drone requires 1S LiPo batteries with PH2.0 connector.";
      case "goggles":
        return `These goggles are compatible with standard analog video transmitters${component.name.includes("DJI") ? " and DJI digital system" : ""}.`;
      case "radio":
        return `This radio supports ${(component.specifications.protocols as string).split('/').join(', ')} protocols.`;
      case "battery":
        return `This battery is compatible with 1S TinyWhoop drones with ${component.specifications.voltage as string} voltage requirements.`;
      default:
        return "Check component specifications for compatibility details.";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="capitalize">{component.name}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <img 
            className="h-48 w-full object-cover rounded-lg" 
            src={component.image} 
            alt={component.name} 
          />
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-500">{component.description}</p>
        </div>
        
        <div className="mt-5 border-t border-gray-200 pt-4">
          <dl className="divide-y divide-gray-200">
            {Object.entries(component.specifications).map(([key, value]) => (
              <div key={key} className="py-3 flex justify-between">
                <dt className="text-sm font-medium text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</dt>
                <dd className="text-sm text-gray-900">{value as string}</dd>
              </div>
            ))}
          </dl>
        </div>
        
        {/* Compatibility Info */}
        <div className="mt-4 rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3 flex-1 md:flex md:justify-between">
              <p className="text-sm text-blue-700">{getCompatibilityNote()}</p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="mt-6">
          <Button onClick={handleAddToBuild}>
            Add to Build
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
