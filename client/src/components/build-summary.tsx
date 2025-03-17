import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, AlertTriangle } from "lucide-react";
import { useBuild } from "@/lib/hooks/use-build";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { checkCompatibility } from "@/lib/compatibility";
import { Component } from "@shared/schema";

// Define explicit type for our component state
interface BuildComponentState {
  drone: Component | null;
  goggles: Component | null;
  radio: Component | null;
  battery: Component | null;
  accessories: Component[];
}

interface BuildSummaryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BuildSummary({ open, onOpenChange }: BuildSummaryProps) {
  // Extract individual state properties to avoid infinite updates
  const drone = useBuild(state => state.drone);
  const goggles = useBuild(state => state.goggles);
  const radio = useBuild(state => state.radio);
  const battery = useBuild(state => state.battery);
  const accessories = useBuild(state => state.accessories || []);
  const resetBuild = useBuild(state => state.resetBuild);
  
  // Reconstruct build object with proper typing
  const build: BuildComponentState = { 
    drone, 
    goggles, 
    radio, 
    battery, 
    accessories 
  };
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  // Calculate the total price correctly with type safety
  const componentPrice = (drone?.price || 0) + 
                         (goggles?.price || 0) + 
                         (radio?.price || 0) + 
                         (battery?.price || 0);
                         
  const accessoriesPrice = accessories.reduce((sum, acc) => sum + (acc?.price || 0), 0);
  
  const totalPrice = componentPrice + accessoriesPrice;
  
  const compatibilityIssues = checkCompatibility(build);
  const missingComponents = [];
  
  if (!build.drone) missingComponents.push("Drone");
  if (!build.goggles) missingComponents.push("Goggles");
  if (!build.radio) missingComponents.push("Radio");
  if (!build.battery) missingComponents.push("Battery");

  const handleSaveBuild = async () => {
    try {
      setSaving(true);
      
      // Extract component IDs for the build
      const componentIds: Record<string, number | number[] | null> = {
        drone: build.drone?.id || null,
        goggles: build.goggles?.id || null,
        radio: build.radio?.id || null,
        battery: build.battery?.id || null,
        accessories: build.accessories?.map(a => a.id) || []
      };
      
      // Create the build
      const name = `My Build ${new Date().toLocaleString()}`;
      
      await apiRequest("POST", "/api/builds", {
        name,
        createdAt: new Date().toISOString(),
        componentIds
      });
      
      // Invalidate builds query
      queryClient.invalidateQueries({queryKey: ["/api/builds"]});
      
      toast({
        title: "Build Saved",
        description: "Your build has been saved successfully.",
      });
      
      // Close the dialog
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save build:", error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your build.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <Check className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center">Current Build Summary</DialogTitle>
          <DialogDescription className="text-center">
            Review your selected components and check compatibility.
          </DialogDescription>
        </DialogHeader>
        
        <div className="border-t border-b border-gray-200 py-4">
          <dl className="divide-y divide-gray-200">
            <div className="py-3 flex justify-between">
              <dt className="text-sm font-medium text-gray-500">Drone</dt>
              <dd className="text-sm text-gray-900">
                {build.drone ? `${build.drone.name} ($${build.drone.price.toFixed(2)})` : (
                  <span className="text-gray-500 italic">Not selected</span>
                )}
              </dd>
            </div>
            <div className="py-3 flex justify-between">
              <dt className="text-sm font-medium text-gray-500">Goggles</dt>
              <dd className="text-sm text-gray-900">
                {build.goggles ? `${build.goggles.name} ($${build.goggles.price.toFixed(2)})` : (
                  <span className="text-gray-500 italic">Not selected</span>
                )}
              </dd>
            </div>
            <div className="py-3 flex justify-between">
              <dt className="text-sm font-medium text-gray-500">Radio</dt>
              <dd className="text-sm text-gray-900">
                {build.radio ? `${build.radio.name} ($${build.radio.price.toFixed(2)})` : (
                  <span className="text-gray-500 italic">Not selected</span>
                )}
              </dd>
            </div>
            <div className="py-3 flex justify-between">
              <dt className="text-sm font-medium text-gray-500">Battery</dt>
              <dd className="text-sm text-gray-900">
                {build.battery ? `${build.battery.name} ($${build.battery.price.toFixed(2)})` : (
                  <span className="text-gray-500 italic">Not selected</span>
                )}
              </dd>
            </div>
            <div className="py-3">
              <dt className="text-sm font-medium text-gray-500 mb-2">Accessories</dt>
              <dd className="text-sm text-gray-900">
                {build.accessories && build.accessories.length > 0 ? (
                  <ul className="space-y-1">
                    {build.accessories.map(acc => (
                      <li key={acc.id} className="flex justify-between items-center">
                        <span>{acc.name} (${acc.price.toFixed(2)})</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs text-red-500 hover:text-red-700"
                          onClick={() => useBuild.getState().removeComponent("accessory", acc.id)}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-500 italic">None</span>
                )}
              </dd>
            </div>
            <div className="py-3 flex justify-between text-base font-medium">
              <dt className="text-gray-900">Total</dt>
              <dd className="text-primary">${totalPrice.toFixed(2)}</dd>
            </div>
          </dl>
        </div>
        
        {/* Compatibility Check */}
        {(missingComponents.length > 0 || compatibilityIssues.length > 0) && (
          <div className="mt-4 rounded-md bg-yellow-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                {missingComponents.length > 0 && (
                  <>
                    <h3 className="text-sm font-medium text-yellow-800">Build Incomplete</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>Your build is missing essential components: {missingComponents.join(", ")}</p>
                    </div>
                  </>
                )}
                
                {compatibilityIssues.length > 0 && (
                  <>
                    <h3 className="text-sm font-medium text-yellow-800 mt-2">Compatibility Issues</h3>
                    <ul className="mt-2 text-sm text-yellow-700 list-disc pl-5">
                      {compatibilityIssues.map((issue, index) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter className="sm:grid sm:grid-cols-2 sm:gap-3">
          <Button variant="default" disabled={saving} onClick={handleSaveBuild}>
            {saving ? "Saving..." : "Save Build"}
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
