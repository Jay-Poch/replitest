import { pgTable, text, serial, integer, boolean, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const components = pgTable("components", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // drone, goggles, radio, battery, accessory
  price: real("price").notNull(),
  image: text("image").notNull(),
  description: text("description").notNull(),
  weight: real("weight"),
  inStock: boolean("in_stock").default(true),
  specifications: jsonb("specifications").notNull(), // Flight time, motors, etc.
  compatibleWith: jsonb("compatible_with").notNull(), // Array of component IDs or categories this is compatible with
  purchaseUrl: text("purchase_url"), // URL to buy the component
});

export const builds = pgTable("builds", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: text("created_at").notNull(),
  componentIds: jsonb("component_ids").notNull(), // Object with component IDs by category
});

export const insertComponentSchema = createInsertSchema(components).omit({
  id: true
});

export const insertBuildSchema = createInsertSchema(builds).omit({
  id: true
});

export type Component = typeof components.$inferSelect;
export type InsertComponent = z.infer<typeof insertComponentSchema>;
export type Build = typeof builds.$inferSelect;
export type InsertBuild = z.infer<typeof insertBuildSchema>;

// Category type validation
export const ComponentCategory = z.enum([
  "drone", 
  "goggles", 
  "radio", 
  "battery", 
  "accessory"
]);

export type ComponentCategory = z.infer<typeof ComponentCategory>;

// Enhanced component schema for validation
export const ComponentSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  category: ComponentCategory,
  price: z.number().min(0, "Price must be a positive number"),
  image: z.string().min(1, "Image URL is required"),
  description: z.string().min(1, "Description is required"),
  weight: z.number().optional(),
  inStock: z.boolean().default(true),
  specifications: z.record(z.string(), z.any()),
  compatibleWith: z.array(z.string()),
  purchaseUrl: z.string().url("Must be a valid URL").optional()
});

// Build object schema
export const BuildSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  createdAt: z.string(),
  componentIds: z.record(z.string(), z.number().nullable())
});

// Build object with components
export interface BuildWithComponents {
  id: number;
  name: string;
  createdAt: string;
  components: {
    drone: Component | null;
    goggles: Component | null;
    radio: Component | null;
    battery: Component | null;
    accessories: Component[];
  };
}
