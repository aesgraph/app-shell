import { createContext } from "react";

export interface LayoutState {
  horizontal: number[];
  vertical: number[];
}

export interface LayoutContextType {
  saveLayout: (layout: LayoutState) => void;
  loadLayout: () => LayoutState | null;
  clearLayout: () => void;
}

export const LayoutContext = createContext<LayoutContextType | null>(null);
