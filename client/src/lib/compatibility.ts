import { Component } from "@shared/schema";

// Build interface
interface BuildState {
  drone: Component | null;
  goggles: Component | null;
  radio: Component | null;
  battery: Component | null;
  accessories: Component[];
}

// Check compatibility between components
export function checkCompatibility(build: BuildState): string[] {
  const issues: string[] = [];
  
  // If build or drone is not defined, return empty issues array
  if (!build || !build.drone) {
    return issues;
  }
  
  // Ensure compatibleWith is an array
  const droneCompatibility = Array.isArray(build.drone.compatibleWith) 
    ? build.drone.compatibleWith 
    : [];
  
  // Check if battery is compatible with drone
  if (build.battery) {
    const batteryCompatibility = Array.isArray(build.battery.compatibleWith) 
      ? build.battery.compatibleWith 
      : [];
    
    // Check for drone-battery compatibility
    if (!hasCompatibleTag(droneCompatibility, batteryCompatibility)) {
      issues.push(`The selected battery (${build.battery.name}) may not be compatible with your drone (${build.drone.name}).`);
    }
  }
  
  // Check if radio is compatible with drone
  if (build.radio) {
    const radioCompatibility = Array.isArray(build.radio.compatibleWith) 
      ? build.radio.compatibleWith 
      : [];
    
    // Check for drone-radio compatibility
    if (!hasCompatibleTag(droneCompatibility, radioCompatibility)) {
      issues.push(`The selected radio (${build.radio.name}) may not be compatible with your drone (${build.drone.name}).`);
    }
  }
  
  // Check if goggles are compatible with drone
  // For most analog systems, all goggles work with all drones
  // For digital systems like DJI, they need to be specifically compatible
  if (build.goggles) {
    const gogglesCompatibility = Array.isArray(build.goggles.compatibleWith) 
      ? build.goggles.compatibleWith 
      : [];
    
    if (!gogglesCompatibility.includes("all")) {
      // Check for drone-goggles compatibility for digital systems
      if (gogglesCompatibility.some(tag => tag.includes("dji")) && 
          !droneCompatibility.some(tag => tag.includes("dji"))) {
        issues.push(`The selected goggles (${build.goggles.name}) are a digital system and may not be compatible with your analog drone (${build.drone.name}).`);
      }
    }
  }
  
  return issues;
}

// Helper function to check if two compatibility arrays have at least one tag in common
function hasCompatibleTag(tags1: string[], tags2: string[]): boolean {
  // If either has "all" tag, they're compatible
  if (tags1.includes("all") || tags2.includes("all")) {
    return true;
  }
  
  // Check for common tags
  return tags1.some(tag => tags2.includes(tag));
}
