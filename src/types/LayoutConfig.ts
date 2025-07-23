import { ReactNode, ComponentType } from "react";

export interface TabConfig {
  id: string;
  title: string;
  content: string | ReactNode | ComponentType<Record<string, unknown>>; // Can be a view ID, JSX content, or React component
  closable?: boolean;
}

export interface PaneConfig {
  tabs: TabConfig[];
  activeTabId?: string;
}

export type PaneType = "left" | "center" | "right" | "bottom";

export interface LayoutConfig {
  layout: [number, number, number]; // [left, center, right] widths as percentages
  bottomHeight: number; // bottom pane height as percentage
  panes: {
    left: PaneConfig;
    center: PaneConfig;
    right: PaneConfig;
    bottom: PaneConfig;
  };
  maximizedPane?: PaneType | null;
}

export interface LayoutManagerProps {
  initialConfig?: LayoutConfig;
  onConfigChange?: (config: LayoutConfig) => void;
}
