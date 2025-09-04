import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { schemaTypes } from "./sanity/schemas";
import { structure } from "./sanity/structure";
import { documentActions } from "./sanity/documentActions";

export default defineConfig({
  name: "default",
  title: "EmpireBD",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,

  plugins: [structureTool({ structure }), visionTool()],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: documentActions,
  },

  basePath: "/studio",
});
