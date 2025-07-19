export interface ViewDefinition {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  component: React.ComponentType<Record<string, unknown>>;
  props?: Record<string, unknown>;
  category?: string;
}

export interface ViewRegistry {
  registerView(view: ViewDefinition): void;
  unregisterView(viewId: string): void;
  getView(viewId: string): ViewDefinition | undefined;
  getAllViews(): ViewDefinition[];
  getViewsByCategory(category?: string): ViewDefinition[];
}

export class DefaultViewRegistry implements ViewRegistry {
  private views = new Map<string, ViewDefinition>();

  registerView(view: ViewDefinition): void {
    this.views.set(view.id, view);
  }

  unregisterView(viewId: string): void {
    this.views.delete(viewId);
  }

  getView(viewId: string): ViewDefinition | undefined {
    return this.views.get(viewId);
  }

  getAllViews(): ViewDefinition[] {
    return Array.from(this.views.values());
  }

  getViewsByCategory(category?: string): ViewDefinition[] {
    const allViews = this.getAllViews();
    if (!category) return allViews;
    return allViews.filter((view) => view.category === category);
  }
}

// Global view registry instance
export const globalViewRegistry = new DefaultViewRegistry();
