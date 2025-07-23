import React from "react";
import { ExampleThemedComponent } from "./examples/ExampleThemedComponent";

// Wrapper components for components with specific prop requirements
export const ExampleThemedComponentWrapper: React.FC<
  Record<string, unknown>
> = () => (
  <ExampleThemedComponent
    title="Theme Demo Component"
    content="This component demonstrates how to use the app-shell theme system in your own components."
  />
);
