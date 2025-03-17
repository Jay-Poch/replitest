import React, { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { ComponentCard } from "@/components/ui/component-card";
import { PartDetails } from "@/components/part-details";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useBuild } from "@/lib/hooks/use-build";
import { Component } from "@shared/schema";
import { useFilter } from "@/lib/hooks/use-filter";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, AlertTriangle } from "lucide-react";
import { checkCompatibility } from "@/lib/compatibility";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("drones");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("price-asc");
  
  // Access each piece of state individually to prevent re-renders when other parts change
  const drone = useBuild(state => state.drone);
  const goggles = useBuild(state => state.goggles);
  const radio = useBuild(state => state.radio);
  const battery = useBuild(state => state.battery);
  const accessories = useBuild(state => state.accessories);
  
  // Debug only on mount
  useEffect(() => {
    // Log once on component mount
    console.log("Initial build state:", { 
      drone: drone?.id || null, 
      goggles: goggles?.id || null, 
      radio: radio?.id || null, 
      battery: battery?.id || null, 
      accessories: accessories?.map(a => a.id) || [] 
    });
  }, []);
  
  // Import the interface from compatibility.ts
  interface BuildComponentState {
    drone: Component | null;
    goggles: Component | null;
    radio: Component | null;
    battery: Component | null;
    accessories: Component[];
  }
  
  // Reconstruct build object with proper typing
  const build: BuildComponentState = { 
    drone, 
    goggles, 
    radio, 
    battery, 
    accessories: accessories || [] 
  };
  const { filters } = useFilter();
  
  // Convert category to API endpoint format
  const categoryToEndpoint: Record<string, string> = {
    drones: "drone",
    goggles: "goggles",
    radios: "radio",
    batteries: "battery",
    accessories: "accessory"
  };
  
  // Add debug logging
  console.log("Current category:", currentCategory, "API category:", categoryToEndpoint[currentCategory]);
  
  const apiCategory = categoryToEndpoint[currentCategory];
  
  // Fetch components
  const { data: components = [], isLoading } = useQuery<Component[]>({
    queryKey: [`/api/components?category=${apiCategory}`],
  });
  
  // Handle component filtering
  const filteredComponents = components.filter((component: Component) => {
    // Search term filter
    if (searchTerm && !component.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !component.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Price filter
    if (component.price > filters.maxPrice) {
      return false;
    }
    
    // Weight filter (if applicable)
    if (component.weight && component.weight > filters.maxWeight) {
      return false;
    }
    
    // In stock filter
    if (filters.inStockOnly && !component.inStock) {
      return false;
    }
    
    return true;
  });
  
  // Sort components
  const sortedComponents = [...filteredComponents].sort((a: Component, b: Component) => {
    switch (sortOption) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });
  
  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);
    setSidebarOpen(false);
  };
  
  const handleViewDetails = (component: Component) => {
    setSelectedComponent(component);
    setDetailsOpen(true);
  };
  
  // Check compatibility issues
  const compatibilityIssues = build ? checkCompatibility(build) : [];
  const showCompatibilityWarning = currentCategory === "batteries" && 
    build?.drone && compatibilityIssues.some(issue => issue.includes("battery"));

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row">
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)}
            currentCategory={currentCategory}
            onCategoryChange={handleCategoryChange}
          />
          
          <main className="flex-1 px-4 py-6">
            {/* Mobile category tabs */}
            <div className="border-b border-gray-200 mb-6 md:hidden">
              <div className="flex overflow-x-auto pb-3 space-x-4">
                {["drones", "goggles", "radios", "batteries", "accessories"].map((category) => (
                  <button
                    key={category}
                    onClick={() => setCurrentCategory(category)}
                    className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm ${
                      currentCategory === category
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Current build status */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Current Build</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Select components to complete your build</p>
                </div>
                <div>
                  <Button 
                    size="sm" 
                    onClick={() => document.getElementById("build-summary-button")?.click()}
                  >
                    View Complete Build
                  </Button>
                </div>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 capitalize">Drone</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {!build?.drone ? (
                        <span className="text-gray-400 italic">Not selected</span>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span>{build.drone.name}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs text-red-500 hover:text-red-700"
                            onClick={() => {
                              console.log("Removing drone component");
                              useBuild.getState().removeComponent("drone");
                              // Verify state after removal
                              console.log("After removal, state is:", useBuild.getState());
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                    </dd>
                  </div>
                  
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 capitalize">Goggles</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {!build?.goggles ? (
                        <span className="text-gray-400 italic">Not selected</span>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span>{build?.goggles?.name}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs text-red-500 hover:text-red-700"
                            onClick={() => useBuild.getState().removeComponent("goggles")}
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                    </dd>
                  </div>
                  
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 capitalize">Radio</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {!build?.radio ? (
                        <span className="text-gray-400 italic">Not selected</span>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span>{build?.radio?.name}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs text-red-500 hover:text-red-700"
                            onClick={() => useBuild.getState().removeComponent("radio")}
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                    </dd>
                  </div>
                  
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 capitalize">Battery</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {!build?.battery ? (
                        <span className="text-gray-400 italic">Not selected</span>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span>{build?.battery?.name}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs text-red-500 hover:text-red-700"
                            onClick={() => useBuild.getState().removeComponent("battery")}
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                    </dd>
                  </div>
                  
                  {/* Accessories section */}
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 capitalize">Accessories</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {!build?.accessories || build.accessories.length === 0 ? (
                        <span className="text-gray-400 italic">No accessories selected</span>
                      ) : (
                        <div className="space-y-2">
                          {build.accessories.map((accessory) => (
                            <div key={accessory.id} className="flex items-center justify-between">
                              <span>{accessory.name}</span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-xs text-red-500 hover:text-red-700"
                                onClick={() => {
                                  console.log("Removing accessory:", accessory.id);
                                  useBuild.getState().removeComponent("accessory", accessory.id);
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            
            {/* Component category title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6 capitalize">
              {currentCategory}
            </h2>
            
            {/* Alert for compatibility issues */}
            {showCompatibilityWarning && (
              <div className="rounded-md bg-yellow-50 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Compatibility Notice</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>Some batteries may not be compatible with your selected drone ({build.drone?.name}). We recommend 1S batteries for this build.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Search and sort controls */}
            <div className="flex flex-col sm:flex-row justify-between mb-6">
              <div className="w-full sm:w-64 mb-4 sm:mb-0">
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex">
                <Select
                  value={sortOption}
                  onValueChange={setSortOption}
                >
                  <SelectTrigger className="w-48 mr-4">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="price-asc">Sort by Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Sort by Price: High to Low</SelectItem>
                      <SelectItem value="name-asc">Sort by Name: A to Z</SelectItem>
                      <SelectItem value="name-desc">Sort by Name: Z to A</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="icon" className="md:hidden" onClick={() => setSidebarOpen(true)}>
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Component grid */}
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : sortedComponents.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">No components found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {sortedComponents.map((component: Component) => (
                  <ComponentCard
                    key={component.id}
                    component={component}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
            
            {/* Pagination */}
            <div className="mt-8 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{sortedComponents.length}</span> of <span className="font-medium">{filteredComponents.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <Button variant="outline" size="icon" className="rounded-l-md">
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </Button>
                  <Button variant="outline">1</Button>
                  <Button variant="outline" className="rounded-r-md">
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </Button>
                </nav>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      <PartDetails
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        component={selectedComponent}
      />
    </div>
  );
}
