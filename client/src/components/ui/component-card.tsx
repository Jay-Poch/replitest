import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, Share2, ShoppingCart } from "lucide-react";
import { Component } from "@shared/schema";
import { useBuild } from "@/lib/hooks/use-build";

interface ComponentCardProps {
  component: Component;
  onViewDetails: (component: Component) => void;
}

export function ComponentCard({ component, onViewDetails }: ComponentCardProps) {
  // Use get state directly to avoid stale closure issues
  // Don't destructure the addComponent method
  const {
    id,
    name,
    category,
    price,
    image,
    description,
    inStock,
    specifications,
    purchaseUrl
  } = component;

  // Convert specifications object to array for display
  const specsArray = Object.entries(specifications).slice(0, 4);

  const handleAddToBuild = () => {
    // Log the category for debugging
    console.log(`Component card: Adding component with category ${category}`, { id: component.id, name: component.name });
    
    // First get the current state to see what's in it
    const buildState = useBuild.getState();
    console.log(`Before adding ${category}, current state:`, {
      drone: buildState.drone?.id,
      goggles: buildState.goggles?.id,
      radio: buildState.radio?.id,
      battery: buildState.battery?.id,
      accessories: buildState.accessories?.map(a => a.id)
    });
    
    // Now add the component with better error handling
    try {
      // Clone the component to ensure we don't have reference issues
      const componentToAdd = { ...component };
      buildState.addComponent(category, componentToAdd);
      
      // Check if it was added successfully
      const updatedState = useBuild.getState();
      console.log(`After adding ${category}, state is now:`, {
        drone: updatedState.drone?.id,
        goggles: updatedState.goggles?.id,
        radio: updatedState.radio?.id,
        battery: updatedState.battery?.id,
        accessories: updatedState.accessories?.map(a => a.id)
      });
    } catch (error) {
      console.error(`Error adding component to build:`, error);
    }
  };

  return (
    <Card className="overflow-hidden shadow hover:shadow-md transition-shadow duration-200 ease-in-out">
      <div className="relative">
        <img 
          className="h-48 w-full object-cover" 
          src={image} 
          alt={name} 
        />
        <div className={`absolute top-2 right-2 text-xs font-semibold px-2.5 py-0.5 rounded ${
          inStock 
            ? "bg-green-100 text-green-800" 
            : "bg-yellow-100 text-yellow-800"
        }`}>
          {inStock ? "In Stock" : "Low Stock"}
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <span className="text-lg font-bold text-gray-900">${price.toFixed(2)}</span>
        </div>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
        
        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            {specsArray.map(([key, value]) => (
              <div key={key}>
                <span className="text-gray-500">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                <span className="font-medium ml-1">{value as string}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-4 flex space-x-2">
          <Button 
            className="flex-1" 
            onClick={handleAddToBuild}
          >
            Add to Build
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => onViewDetails(component)}
          >
            <Info className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
