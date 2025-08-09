import type { PaneType } from "../types/LayoutConfig";

export interface PaneContextMenuContext {
  panelId: PaneType;
  tabs: Array<{ id: string; title: string; content: unknown }>;
  activeTabId: string;
}

export interface PaneContextMenuItemOptions {
  id: string;
  label: string;
  onSelect: (context: PaneContextMenuContext) => void;
  disabled?: boolean | ((context: PaneContextMenuContext) => boolean);
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
            onSelect: () => void;
          }
        | { type: "separator" }
      >;
    }>;

    const { context, items } = custom.detail || ({} as any);
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
      onSelect: () => options.onSelect(context),
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
