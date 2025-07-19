import { WorkspaceContext } from "./WorkspaceContext";
import { useContext } from "react";

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx)
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  return ctx;
}
