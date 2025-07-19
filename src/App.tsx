import Workspace from "./components/Workspace";
import { WorkspaceProvider } from "./contexts/WorkspaceContext";
import type { WorkspaceConfig } from "./types/WorkspaceConfig";

function App() {
  const PANE_COLLAPSE_THRESHOLD = 80;
  const PANE_MIN_SIZE = PANE_COLLAPSE_THRESHOLD - 10;
  const PANE_MAX_SIZE = 700;

  const workspaceConfig: Partial<WorkspaceConfig> = {
    theme: "dark",
    leftPane: {
      defaultSize: 250,
      maxSize: PANE_MAX_SIZE,
      minSize: PANE_MIN_SIZE,
      collapseThreshold: PANE_COLLAPSE_THRESHOLD,
      collapsedSize: 8,
    },
    rightPane: {
      defaultSize: 300,
      maxSize: PANE_MAX_SIZE,
      minSize: PANE_MIN_SIZE,
      collapseThreshold: PANE_COLLAPSE_THRESHOLD,
      collapsedSize: 8,
    },
    bottomPane: {
      defaultSize: 200,
      maxSize: PANE_MAX_SIZE,
      minSize: PANE_MIN_SIZE,
      collapseThreshold: PANE_COLLAPSE_THRESHOLD,
      collapsedSize: 8,
    },
  };

  return (
    <WorkspaceProvider initialConfig={workspaceConfig}>
      <Workspace />
    </WorkspaceProvider>
  );
}

export default App;
