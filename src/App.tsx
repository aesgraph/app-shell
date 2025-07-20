import Workspace from "./components/Workspace";
import WorkspaceNew from "./components/WorkspaceNew";
import { WorkspaceProvider } from "./contexts/WorkspaceContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import type { WorkspaceConfig } from "./types/WorkspaceConfig";

function App() {
  const PANE_COLLAPSE_THRESHOLD = 80;
  const PANE_MIN_SIZE = PANE_COLLAPSE_THRESHOLD - 10;
  const PANE_MAX_SIZE = 700;

  // Toggle this to switch between container mode and fullscreen mode
  const useContainerMode = true;

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
    <>
      {useContainerMode ? (
        // Container mode - workspace embedded in a larger UI
        <WorkspaceNew />
      ) : (
        // Full viewport mode - workspace takes entire screen
        <ThemeProvider themeId="dark">
          <WorkspaceProvider initialConfig={workspaceConfig}>
            <Workspace fullViewport={true} />
          </WorkspaceProvider>
        </ThemeProvider>
      )}
    </>
  );
}

export default App;
