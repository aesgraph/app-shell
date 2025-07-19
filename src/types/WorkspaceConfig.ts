import type { ThemeId } from "./Theme";

export interface WorkspaceConfig {
  leftPane: {
    defaultSize: number;
    minSize: number;
    maxSize: number;
    collapsedSize: number;
    collapseThreshold: number;
  };
  rightPane: {
    defaultSize: number;
    minSize: number;
    maxSize: number;
    collapsedSize: number;
    collapseThreshold: number;
  };
  bottomPane: {
    defaultSize: number;
    minSize: number;
    maxSize: number;
    collapsedSize: number;
    collapseThreshold: number;
  };
  theme: ThemeId;
}

export const DEFAULT_WORKSPACE_CONFIG: WorkspaceConfig = {
  leftPane: {
    defaultSize: 240,
    minSize: 120,
    maxSize: 400,
    collapsedSize: 8,
    collapseThreshold: 40,
  },
  rightPane: {
    defaultSize: 320,
    minSize: 120,
    maxSize: 500,
    collapsedSize: 8,
    collapseThreshold: 40,
  },
  bottomPane: {
    defaultSize: 180,
    minSize: 80,
    maxSize: 400,
    collapsedSize: 8,
    collapseThreshold: 40,
  },
  theme: "dark",
};
