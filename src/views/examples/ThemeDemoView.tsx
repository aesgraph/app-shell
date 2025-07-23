import React from "react";
import { ExampleThemedComponent } from "./ExampleThemedComponent";

/**
 * Theme Demo View component for demonstrating theme usage
 */
const ThemeDemoView: React.FC = () => (
  <ExampleThemedComponent
    title="Theme Demo"
    content="This is an example of a themed component that adapts to the current workspace theme. You can see how colors, spacing, and other theme properties are applied automatically."
  />
);

export default ThemeDemoView;
