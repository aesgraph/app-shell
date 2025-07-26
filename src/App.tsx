import { WorkspaceContainerDemo, LayoutManagerDemo } from "./demos";
import { AppShellProvider } from "./contexts/AppShellContext";
import { LayoutManager } from "./components/LayoutManager";

function App() {
  // Toggle this to switch between different modes
  const useContainerMode = true;
  const layoutManagerDemo = false; // Set to false to test dropdown

  const getComponent = () => {
    if (layoutManagerDemo) {
      return <LayoutManagerDemo />;
    }
    if (useContainerMode) {
      return <WorkspaceContainerDemo />;
    }

    return <LayoutManager />;
  };

  return (
    <AppShellProvider themeId="dracula">{getComponent()}</AppShellProvider>
  );
}

export default App;
