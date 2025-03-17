import { components, builds, Component, InsertComponent, Build, InsertBuild, BuildWithComponents } from "@shared/schema";

export interface IStorage {
  // Component operations
  getComponents(category?: string): Promise<Component[]>;
  getComponent(id: number): Promise<Component | undefined>;
  createComponent(component: InsertComponent): Promise<Component>;
  updateComponent(id: number, component: Partial<Component>): Promise<Component | undefined>;
  deleteComponent(id: number): Promise<boolean>;
  
  // Build operations
  getBuilds(): Promise<Build[]>;
  getBuild(id: number): Promise<Build | undefined>;
  getBuildWithComponents(id: number): Promise<BuildWithComponents | undefined>;
  createBuild(build: InsertBuild): Promise<Build>;
  updateBuild(id: number, build: Partial<Build>): Promise<Build | undefined>;
  deleteBuild(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private components: Map<number, Component>;
  private builds: Map<number, Build>;
  private componentId: number;
  private buildId: number;

  constructor() {
    this.components = new Map();
    this.builds = new Map();
    this.componentId = 1;
    this.buildId = 1;
    
    // Initialize with some sample components
    this.initializeComponents();
  }

  private initializeComponents() {
    // Drones
    this.createComponent({
      name: "HappyModel Mobula 6 1S",
      category: "drone",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      description: "Ultra-light 1S whoop with 65mm propellers",
      weight: 20,
      inStock: true,
      specifications: {
        weight: "20g",
        motors: "19000KV",
        flightTime: "~4-5 min",
        fc: "F4 1S",
        camera: "RunCam Nano 3",
        receiver: "SPI"
      },
      compatibleWith: ["battery-1s", "radio-frsky", "radio-flysky"]
    });

    this.createComponent({
      name: "BetaFPV Meteor65",
      category: "drone",
      price: 99.99,
      image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      description: "65mm 1S brushless whoop with F4 FC",
      weight: 23,
      inStock: true,
      specifications: {
        weight: "23g",
        motors: "18000KV",
        flightTime: "~4 min",
        fc: "F4 1S",
        camera: "CMOS",
        receiver: "SPI/ELRS"
      },
      compatibleWith: ["battery-1s", "radio-frsky", "radio-elrs"]
    });
    
    // Goggles
    this.createComponent({
      name: "FatShark Recon V3",
      category: "goggles",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1596566727241-dd546bb8c9fa?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      description: "Entry-level box goggles with 40CH receiver",
      weight: 380,
      inStock: true,
      specifications: {
        resolution: "800×480",
        fov: "55°",
        dvr: "Yes",
        battery: "3.7V 1800mAh"
      },
      compatibleWith: ["all"]
    });

    this.createComponent({
      name: "DJI FPV Goggles V2",
      category: "goggles",
      price: 569.99,
      image: "https://images.unsplash.com/photo-1578347378134-42e465b6230f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      description: "HD digital FPV system with low latency",
      weight: 420,
      inStock: true,
      specifications: {
        resolution: "1440×810",
        fov: "150°",
        latency: "~28ms",
        refreshRate: "144Hz"
      },
      compatibleWith: ["dji-air-unit"]
    });
    
    // Radios
    this.createComponent({
      name: "RadioMaster TX16S",
      category: "radio",
      price: 189.99,
      image: "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      description: "Multi-protocol OpenTX radio with hall sensor gimbals",
      weight: 700,
      inStock: true,
      specifications: {
        channels: "16",
        firmware: "OpenTX",
        protocols: "Multi-module",
        battery: "2x 18650"
      },
      compatibleWith: ["radio-frsky", "radio-flysky", "radio-spektrum", "radio-elrs"]
    });

    this.createComponent({
      name: "BetaFPV LiteRadio 2",
      category: "radio",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1581092446327-9b52bd1570c2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      description: "Compact game-style controller with FrSky D8 protocol",
      weight: 210,
      inStock: true,
      specifications: {
        channels: "8",
        protocols: "FrSky D8/D16",
        battery: "1000mAh",
        usb: "Simulator Compatible"
      },
      compatibleWith: ["radio-frsky"]
    });
    
    // Batteries
    this.createComponent({
      name: "GNB 300mAh 1S LiPo",
      category: "battery",
      price: 5.99,
      image: "https://images.unsplash.com/photo-1595661671316-5ced32a0a678?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      description: "High-discharge 1S battery for TinyWhoop drones",
      weight: 8.5,
      inStock: true,
      specifications: {
        capacity: "300mAh",
        voltage: "3.8V HV",
        discharge: "30C",
        weight: "8.5g"
      },
      compatibleWith: ["battery-1s"]
    });

    this.createComponent({
      name: "Tattu 450mAh 1S LiPo",
      category: "battery",
      price: 7.99,
      image: "https://images.unsplash.com/photo-1595661671316-5ced32a0a678?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      description: "High-capacity 1S battery for extended flight times",
      weight: 10.5,
      inStock: true,
      specifications: {
        capacity: "450mAh",
        voltage: "3.7V",
        discharge: "25C",
        weight: "10.5g"
      },
      compatibleWith: ["battery-1s"]
    });
    
    // Accessories
    this.createComponent({
      name: "Gemfan 31mm Props",
      category: "accessory",
      price: 3.99,
      image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      description: "Durable micro propellers for 0.8mm shafts (set of 8)",
      weight: 0.5,
      inStock: true,
      specifications: {
        size: "31mm",
        pitch: "3 Blade",
        quantity: "8pcs",
        material: "Polycarbonate"
      },
      compatibleWith: ["all"]
    });

    this.createComponent({
      name: "URUAV 1S LiPo Charger",
      category: "accessory",
      price: 19.99,
      image: "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      description: "6-port USB charger for 1S batteries with storage mode",
      weight: 45,
      inStock: true,
      specifications: {
        ports: "6",
        connector: "PH2.0",
        power: "USB-C",
        features: "Storage Mode"
      },
      compatibleWith: ["battery-1s"]
    });
  }
  
  // Component operations
  async getComponents(category?: string): Promise<Component[]> {
    const allComponents = Array.from(this.components.values());
    
    if (category) {
      return allComponents.filter(component => component.category === category);
    }
    
    return allComponents;
  }

  async getComponent(id: number): Promise<Component | undefined> {
    return this.components.get(id);
  }

  async createComponent(component: InsertComponent): Promise<Component> {
    const id = this.componentId++;
    const newComponent = { ...component, id };
    this.components.set(id, newComponent);
    return newComponent;
  }

  async updateComponent(id: number, update: Partial<Component>): Promise<Component | undefined> {
    const component = this.components.get(id);
    
    if (!component) {
      return undefined;
    }
    
    const updatedComponent = { ...component, ...update };
    this.components.set(id, updatedComponent);
    return updatedComponent;
  }

  async deleteComponent(id: number): Promise<boolean> {
    return this.components.delete(id);
  }
  
  // Build operations
  async getBuilds(): Promise<Build[]> {
    return Array.from(this.builds.values());
  }

  async getBuild(id: number): Promise<Build | undefined> {
    return this.builds.get(id);
  }

  async getBuildWithComponents(id: number): Promise<BuildWithComponents | undefined> {
    const build = this.builds.get(id);
    
    if (!build) {
      return undefined;
    }
    
    const componentIds = build.componentIds as Record<string, number | null>;
    
    // Convert to BuildWithComponents format
    const buildWithComponents: BuildWithComponents = {
      id: build.id,
      name: build.name,
      createdAt: build.createdAt,
      components: {
        drone: null,
        goggles: null,
        radio: null,
        battery: null,
        accessories: []
      }
    };
    
    // Fill in the components
    if (componentIds.drone) {
      buildWithComponents.components.drone = await this.getComponent(componentIds.drone) || null;
    }
    
    if (componentIds.goggles) {
      buildWithComponents.components.goggles = await this.getComponent(componentIds.goggles) || null;
    }
    
    if (componentIds.radio) {
      buildWithComponents.components.radio = await this.getComponent(componentIds.radio) || null;
    }
    
    if (componentIds.battery) {
      buildWithComponents.components.battery = await this.getComponent(componentIds.battery) || null;
    }
    
    if (Array.isArray(componentIds.accessories)) {
      for (const accessoryId of componentIds.accessories) {
        const accessory = await this.getComponent(accessoryId);
        if (accessory) {
          buildWithComponents.components.accessories.push(accessory);
        }
      }
    }
    
    return buildWithComponents;
  }

  async createBuild(build: InsertBuild): Promise<Build> {
    const id = this.buildId++;
    const newBuild = { ...build, id };
    this.builds.set(id, newBuild);
    return newBuild;
  }

  async updateBuild(id: number, update: Partial<Build>): Promise<Build | undefined> {
    const build = this.builds.get(id);
    
    if (!build) {
      return undefined;
    }
    
    const updatedBuild = { ...build, ...update };
    this.builds.set(id, updatedBuild);
    return updatedBuild;
  }

  async deleteBuild(id: number): Promise<boolean> {
    return this.builds.delete(id);
  }
}

export const storage = new MemStorage();
