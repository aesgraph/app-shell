import {
  WorkspaceContainerDemo,
  WorkspaceDemo,
  LayoutManagerDemo,
} from "./demos";
import { AppShellProvider } from "./contexts/AppShellContext";
import { LayoutManager } from "./components/LayoutManager";

function App() {
  // Toggle this to switch between different modes
  const useNewLayout = true; // Try the new react-resizable-panels layout
  const useContainerMode = false;
  const layoutManagerDemo = false; // Set to false to test dropdown

  const getComponent = () => {
    if (layoutManagerDemo) {
      return <LayoutManagerDemo />;
    }
    if (useContainerMode) {
      return <WorkspaceContainerDemo />;
    }

    if (useNewLayout) {
      return <WorkspaceDemo />;
    }
    return <LayoutManager />;
  };
  return <AppShellProvider themeId="dark">{getComponent()}</AppShellProvider>;
}

export default App;
