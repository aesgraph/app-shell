import WorkspaceContainerDemo from "./components/WorkspaceContainer";
import WorkspaceDemo from "./components/WorkspaceDemo";
import { WorkspaceProvider } from "./contexts/WorkspaceContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LayoutManager } from "./components/LayoutManager";

function App() {
  // Toggle this to switch between different modes
  const useNewLayout = true; // Try the new react-resizable-panels layout
  const useContainerMode = false;

  if (useNewLayout) {
    // New layout system with react-resizable-panels
    return <WorkspaceDemo />;
  }

  return (
    <>
      {useContainerMode ? (
        // Container mode - workspace embedded in a larger UI
        <WorkspaceContainerDemo />
      ) : (
        // Full viewport mode - workspace takes entire screen
        <ThemeProvider themeId="dark">
          <WorkspaceProvider>
            <LayoutManager />
          </WorkspaceProvider>
        </ThemeProvider>
      )}
    </>
  );
}

export default App;
