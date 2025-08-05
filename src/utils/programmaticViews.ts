import { globalViewRegistry, ViewDefinition } from "../types/ViewRegistry";
import type { PaneType } from "../types/LayoutConfig";

export interface AddViewOptions {
  viewId: string;
  pane: PaneType;
  props?: Record<string, unknown>;
  title?: string;
  activate?: boolean; // Whether to make this tab active immediately
}

export interface AddCustomViewOptions {
  component: React.ComponentType<Record<string, unknown>>;
  title: string;
  pane: PaneType;
  props?: Record<string, unknown>;
  activate?: boolean;
}

/**
 * Add a registered view as a tab to a specific pane
 *
 * @example
 * ```typescript
 * import { addViewAsTab } from "@aesgraph/app-shell";
 *
 * // Add a simple view
 * const tabId = addViewAsTab({
 *   viewId: "workspace-manager",
 *   pane: "left"
 * });
 *
 * // Add a view with custom props
 * const tabId = addViewAsTab({
 *   viewId: "file-explorer",
 *   pane: "center",
 *   props: { initialPath: "/home/user", showHidden: true },
 *   title: "My Files"
 * });
 *
 * // Add a view without activating it
 * const tabId = addViewAsTab({
 *   viewId: "terminal",
 *   pane: "bottom",
 *   activate: false
 * });
 * ```
 *
 * @param options Configuration for adding the view
 * @returns The generated tab ID, or null if the view wasn't found
 */
export function addViewAsTab(options: AddViewOptions): string | null {
  const { viewId, pane, props = {}, title, activate = true } = options;

  const viewDef = globalViewRegistry.getView(viewId);
  if (!viewDef) {
    console.warn(`View with ID "${viewId}" not found in registry`);
    return null;
  }

  const tabId = `${viewId}-${Date.now()}`;

  // Create custom event to add the tab
  const event = new CustomEvent("add-tab", {
    detail: {
      viewId,
      panelId: pane,
      props,
      title: title || viewDef.title,
      activate,
    },
  });

  document.dispatchEvent(event);
  return tabId;
}

/**
 * Add a custom component as a tab to a specific pane
 *
 * This function allows you to add any React component as a tab without
 * pre-registering it in the view registry. The component is added directly
 * without affecting the global view registry.
 *
 * @example
 * ```typescript
 * import { addCustomViewAsTab } from "@aesgraph/app-shell";
 *
 * // Add a custom component
 * const MyCustomComponent = ({ data }) => (
 *   <div>Custom content: {data}</div>
 * );
 *
 * const tabId = addCustomViewAsTab({
 *   component: MyCustomComponent,
 *   title: "Custom View",
 *   pane: "right",
 *   props: { data: "Hello World" }
 * });
 * ```
 *
 * @param options Configuration for adding the custom view
 * @returns The generated tab ID
 */
export function addCustomViewAsTab(options: AddCustomViewOptions): string {
  const { component, title, pane, props = {}, activate = true } = options;

  const tabId = `custom-${Date.now()}`;

  // Create custom event to add the tab directly with component
  const event = new CustomEvent("add-custom-tab", {
    detail: {
      tabId,
      component,
      title,
      panelId: pane,
      props,
      activate,
    },
  });

  document.dispatchEvent(event);
  return tabId;
}

/**
 * Add multiple views as tabs in batch
 *
 * @example
 * ```typescript
 * import { addViewsAsTabs } from "@aesgraph/app-shell";
 *
 * const tabIds = addViewsAsTabs([
 *   { viewId: "file-explorer", pane: "left" },
 *   { viewId: "terminal", pane: "bottom", props: { sessionId: "main" } },
 *   { viewId: "properties", pane: "right", activate: false }
 * ]);
 * ```
 *
 * @param views Array of view configurations
 * @returns Array of generated tab IDs
 */
export function addViewsAsTabs(views: AddViewOptions[]): (string | null)[] {
  return views.map(addViewAsTab);
}

/**
 * Add multiple custom views as tabs in batch
 *
 * @param views Array of custom view configurations
 * @returns Array of generated tab IDs
 */
export function addCustomViewsAsTabs(views: AddCustomViewOptions[]): string[] {
  return views.map(addCustomViewAsTab);
}

/**
 * Get all available view IDs that can be added as tabs
 *
 * @example
 * ```typescript
 * import { getAvailableViewIds } from "@aesgraph/app-shell";
 *
 * const availableViews = getAvailableViewIds();
 * console.log("Available views:", availableViews);
 * // Output: ["workspace-manager", "file-explorer", "terminal", ...]
 * ```
 *
 * @returns Array of view IDs
 */
export function getAvailableViewIds(): string[] {
  return globalViewRegistry.getAllViews().map((view) => view.id);
}

/**
 * Get views by category
 *
 * @example
 * ```typescript
 * import { getViewsByCategory } from "@aesgraph/app-shell";
 *
 * const toolViews = getViewsByCategory("tools");
 * console.log("Tool views:", toolViews);
 * ```
 *
 * @param category Category to filter by
 * @returns Array of view definitions
 */
export function getViewsByCategory(category: string): ViewDefinition[] {
  return globalViewRegistry.getViewsByCategory(category);
}

/**
 * Check if a view exists in the registry
 *
 * @example
 * ```typescript
 * import { hasView } from "@aesgraph/app-shell";
 *
 * if (hasView("file-explorer")) {
 *   addViewAsTab({ viewId: "file-explorer", pane: "left" });
 * }
 * ```
 *
 * @param viewId The view ID to check
 * @returns True if the view exists
 */
export function hasView(viewId: string): boolean {
  return globalViewRegistry.getView(viewId) !== undefined;
}
