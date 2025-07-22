import { useContext } from "react";
import { LayoutContext, LayoutContextType } from "./LayoutContext";

export const useLayoutContext = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayoutContext must be used within a LayoutProvider");
  }
  return context;
};
