import type { PaneType } from "../types/LayoutConfig";

export interface PaneContextMenuContext {
  panelId: PaneType;
  tabs: Array<{ id: string; title: string; content: unknown }>;
  activeTabId: string;
}

export interface PaneContextMenuItemOptions {
  id: string;
  label: string;
  /**
   * Click handler for the menu item. Receives the pane context (pane id, tabs, active tab).
   */
  onClick: (context: PaneContextMenuContext) => void;
  /**
   * Whether the item should be disabled. Can be a boolean or a function that
   * evaluates against the current pane context each time the menu opens.
   */
  disabled?: boolean | ((context: PaneContextMenuContext) => boolean);
  /**
   * Predicate to determine whether this item should be INCLUDED for the given
   * pane context. Return true to include, false to omit. This runs on every
   * menu open, so you can make context-aware items (e.g., only show on right pane).
   */
  predicate?: (context: PaneContextMenuContext) => boolean;
  separatorBefore?: boolean;
  separatorAfter?: boolean;
}

/**
 * Programmatically add an item to the pane context menu.
 * Returns a function to unregister the item.
 *
 * Example:
 * const dispose = addToPaneContextMenu({
 *   id: "refresh-pane",
 *   label: "Refresh",
 *   predicate: ({ panelId }) => panelId === "right",
 *   onSelect: (ctx) => console.log("Refresh", ctx.panelId),
 * });
 */
export function addToPaneContextMenu(
  options: PaneContextMenuItemOptions
): () => void {
  const handler = (event: Event) => {
    const custom = event as CustomEvent<{
      context: PaneContextMenuContext;
      items: Array<
        | {
            type?: "item";
            id: string;
            label: string;
            disabled?: boolean;
            onClick: () => void;
          }
        | { type: "separator" }
      >;
    }>;

    const { context, items } =
      (custom.detail as {
        context?: PaneContextMenuContext;
        items?: Array<
          | {
              type?: "item";
              id: string;
              label: string;
              disabled?: boolean;
              onClick: () => void;
            }
          | { type: "separator" }
        >;
      }) || {};
    if (!context || !items) return;

    if (options.predicate && !options.predicate(context)) return;

    const disabled =
      typeof options.disabled === "function"
        ? options.disabled(context)
        : !!options.disabled;

    if (options.separatorBefore) {
      items.push({ type: "separator" });
    }

    items.push({
      id: options.id,
      label: options.label,
      disabled,
      onClick: () => options.onClick(context),
    });

    if (options.separatorAfter) {
      items.push({ type: "separator" });
    }
  };

  document.addEventListener(
    "build-pane-context-menu",
    handler as EventListener
  );
  return () =>
    document.removeEventListener(
      "build-pane-context-menu",
      handler as EventListener
    );
}
