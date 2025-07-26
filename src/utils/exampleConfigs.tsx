import React from "react";
import { LayoutConfig } from "../types/LayoutConfig";
import { PersistentEditor, StatefulCounter } from "../demos/ExampleComponents";

// Example custom configuration for demos and testing
export const exampleCustomConfig: LayoutConfig = {
  layout: [25, 50, 25],
  bottomHeight: 30,
  panes: {
    left: {
      tabs: [
        {
          id: "theme-demo-component",
          title: "Theme Demo",
          content: "theme-demo-component", // Use view ID string for registered views
        },
        {
          id: "stateful-counter",
          title: "Counter",
          content: StatefulCounter, // Use React component directly
        },
      ],
      activeTabId: "theme-demo-component",
    },
    center: {
      tabs: [
        {
          id: "workspace-manager",
          title: "Workspace Manager",
          content: "workspace-manager", // Use view ID string for registered views
        },
        {
          id: "persistent-editor",
          title: "Editor",
          content: PersistentEditor, // Use React component directly for persistent state
        },
      ],
      activeTabId: "workspace-manager",
    },
    right: {
      tabs: [
        {
          id: "workspace-config-editor",
          title: "Theme Selector",
          content: "workspace-config-editor", // Use view ID string for registered views
        },
      ],
      activeTabId: "workspace-config-editor",
    },
    bottom: {
      tabs: [
        {
          id: "terminal",
          title: "Terminal",
          content: React.createElement("div", {}, "Terminal Output"), // Use JSX content
        },
      ],
      activeTabId: "terminal",
    },
  },
  maximizedPane: null,
};
