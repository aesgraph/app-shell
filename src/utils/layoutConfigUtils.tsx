import React from "react";
import { LayoutConfig } from "../types/LayoutConfig";

// Helper function to create default layout configuration
export const createDefaultLayoutConfig = (): LayoutConfig => ({
  layout: [20, 60, 20],
  bottomHeight: 25,
  panes: {
    left: {
      tabs: [
        {
          id: "l1",
          title: "Left Tab 1",
          content: React.createElement("div", {}, "Left Tab 1 Content"),
        },
        {
          id: "l2",
          title: "Left Tab 2",
          content: React.createElement("div", {}, "Left Tab 2 Content"),
        },
      ],
      activeTabId: "l1",
    },
    center: {
      tabs: [
        {
          id: "c1",
          title: "Center Tab 1",
          content: React.createElement("div", {}, "Center Tab 1 Content"),
        },
        {
          id: "c2",
          title: "Center Tab 2",
          content: React.createElement("div", {}, "Center Tab 2 Content"),
        },
      ],
      activeTabId: "c1",
    },
    right: {
      tabs: [
        {
          id: "r1",
          title: "Right Tab 1",
          content: React.createElement("div", {}, "Right Tab 1 Content"),
        },
        {
          id: "r2",
          title: "Right Tab 2",
          content: React.createElement("div", {}, "Right Tab 2 Content"),
        },
      ],
      activeTabId: "r1",
    },
    bottom: {
      tabs: [
        {
          id: "b1",
          title: "Bottom Tab 1",
          content: React.createElement("div", {}, "Bottom Tab 1 Content"),
        },
        {
          id: "b2",
          title: "Bottom Tab 2",
          content: React.createElement("div", {}, "Bottom Tab 2 Content"),
        },
      ],
      activeTabId: "b1",
    },
  },
  maximizedPane: null,
});
