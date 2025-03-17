import { Router, type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBuildSchema, insertComponentSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create API router
  const apiRouter = Router();
  
  // Components routes
  apiRouter.get("/components", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const components = await storage.getComponents(category);
      res.json(components);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch components" });
    }
  });
  
  apiRouter.get("/components/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid component ID" });
      }
      
      const component = await storage.getComponent(id);
      
      if (!component) {
        return res.status(404).json({ error: "Component not found" });
      }
      
      res.json(component);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch component" });
    }
  });
  
  apiRouter.post("/components", async (req, res) => {
    try {
      const componentData = insertComponentSchema.parse(req.body);
      const component = await storage.createComponent(componentData);
      res.status(201).json(component);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid component data", details: error.format() });
      }
      res.status(500).json({ error: "Failed to create component" });
    }
  });
  
  apiRouter.put("/components/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid component ID" });
      }
      
      const componentData = req.body;
      const component = await storage.updateComponent(id, componentData);
      
      if (!component) {
        return res.status(404).json({ error: "Component not found" });
      }
      
      res.json(component);
    } catch (error) {
      res.status(500).json({ error: "Failed to update component" });
    }
  });
  
  apiRouter.delete("/components/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid component ID" });
      }
      
      const success = await storage.deleteComponent(id);
      
      if (!success) {
        return res.status(404).json({ error: "Component not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete component" });
    }
  });
  
  // Builds routes
  apiRouter.get("/builds", async (req, res) => {
    try {
      const builds = await storage.getBuilds();
      res.json(builds);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch builds" });
    }
  });
  
  apiRouter.get("/builds/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid build ID" });
      }
      
      const build = await storage.getBuild(id);
      
      if (!build) {
        return res.status(404).json({ error: "Build not found" });
      }
      
      res.json(build);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch build" });
    }
  });
  
  apiRouter.get("/builds/:id/with-components", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid build ID" });
      }
      
      const buildWithComponents = await storage.getBuildWithComponents(id);
      
      if (!buildWithComponents) {
        return res.status(404).json({ error: "Build not found" });
      }
      
      res.json(buildWithComponents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch build with components" });
    }
  });
  
  apiRouter.post("/builds", async (req, res) => {
    try {
      const buildData = insertBuildSchema.parse(req.body);
      const build = await storage.createBuild(buildData);
      res.status(201).json(build);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid build data", details: error.format() });
      }
      res.status(500).json({ error: "Failed to create build" });
    }
  });
  
  apiRouter.put("/builds/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid build ID" });
      }
      
      const buildData = req.body;
      const build = await storage.updateBuild(id, buildData);
      
      if (!build) {
        return res.status(404).json({ error: "Build not found" });
      }
      
      res.json(build);
    } catch (error) {
      res.status(500).json({ error: "Failed to update build" });
    }
  });
  
  apiRouter.delete("/builds/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid build ID" });
      }
      
      const success = await storage.deleteBuild(id);
      
      if (!success) {
        return res.status(404).json({ error: "Build not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete build" });
    }
  });
  
  // Register routes
  app.use("/api", apiRouter);

  const httpServer = createServer(app);

  return httpServer;
}
