import React from "react";
import { Button } from "@/components/ui/button";
import { X, Plane, Airplay, Radio, Battery, Settings } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useFilter } from "@/lib/hooks/use-filter";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentCategory: string;
  onCategoryChange: (category: string) => void;
}

export function Sidebar({ isOpen, onClose, currentCategory, onCategoryChange }: SidebarProps) {
  const { filters, updateFilter } = useFilter();
  
  const categories = [
    { id: "drones", label: "Drones", icon: <Plane className="mr-3 h-5 w-5" /> },
    { id: "goggles", label: "Goggles", icon: <Airplay className="mr-3 h-5 w-5" /> },
    { id: "radios", label: "Radios", icon: <Radio className="mr-3 h-5 w-5" /> },
    { id: "batteries", label: "Batteries", icon: <Battery className="mr-3 h-5 w-5" /> },
    { id: "accessories", label: "Accessories", icon: <Settings className="mr-3 h-5 w-5" /> }
  ];

  const handleMaxPriceChange = (value: number[]) => {
    updateFilter("maxPrice", value[0]);
  };

  const handleWeightLimitChange = (value: number[]) => {
    updateFilter("maxWeight", value[0]);
  };

  const handleInStockChange = (checked: boolean) => {
    updateFilter("inStockOnly", checked);
  };

  const handleApplyFilters = () => {
    // In a real app, we might dispatch an action or call a function
    // For now, this is handled by the useFilter hook
    onClose();
  };

  return (
    <>
      <div 
        className={`${isOpen ? 'block' : 'hidden'} fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden`} 
        onClick={onClose}
      ></div>
      
      <aside 
        className={`${
          isOpen 
            ? 'translate-x-0' 
            : '-translate-x-full'
        } fixed z-50 inset-y-0 left-0 w-64 transition duration-300 transform bg-white md:relative md:translate-x-0 w-64 md:w-1/4 flex-shrink-0 border-r border-gray-200 pt-5 pb-4 bg-white`}
      >
        <div className="flex items-center px-4 md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="ml-4 flex items-center justify-center h-10 w-10 rounded-md"
          >
            <X className="h-6 w-6 text-gray-400" />
          </Button>
        </div>
        
        <div className="mt-5 px-4 h-0 flex-1 overflow-y-auto">
          <h2 className="text-lg font-medium text-gray-900">Categories</h2>
          <nav className="mt-3">
            <div className="space-y-1">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant="ghost"
                  className={`w-full justify-start ${
                    currentCategory === category.id 
                      ? 'bg-blue-50 text-primary' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => onCategoryChange(category.id)}
                >
                  {category.icon}
                  {category.label}
                </Button>
              ))}
            </div>
          </nav>
          
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900">Filters</h2>
            <div className="mt-4 space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700">Price Range</label>
                <div className="mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">$0</span>
                    <span className="text-xs text-gray-500">$200+</span>
                  </div>
                  <Slider
                    defaultValue={[filters.maxPrice]}
                    max={200}
                    step={1}
                    onValueChange={handleMaxPriceChange}
                    className="w-full h-2 mt-1"
                  />
                  <div className="text-sm text-gray-700 mt-1">
                    Max: ${filters.maxPrice}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="in-stock"
                  checked={filters.inStockOnly}
                  onCheckedChange={handleInStockChange}
                />
                <label
                  htmlFor="in-stock"
                  className="text-sm text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  In Stock Only
                </label>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Max Weight (g)</label>
                <div className="mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">20g</span>
                    <span className="text-xs text-gray-500">50g</span>
                  </div>
                  <Slider
                    defaultValue={[filters.maxWeight]}
                    min={20}
                    max={50}
                    step={1}
                    onValueChange={handleWeightLimitChange}
                    className="w-full h-2 mt-1"
                  />
                  <div className="text-sm text-gray-700 mt-1">
                    {filters.maxWeight}g
                  </div>
                </div>
              </div>
              
              <div>
                <Button className="w-full" onClick={handleApplyFilters}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
