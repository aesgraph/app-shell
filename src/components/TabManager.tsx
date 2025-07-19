import React, { useCallback } from "react";
import TabContainer from "./TabContainer";
import type { TabData } from "./Tab";

interface TabContainerData {
  id: string;
  tabs: TabData[];
  activeTabId?: string;
}

interface TabManagerProps {
  containers: TabContainerData[];
  onContainersChange: (containers: TabContainerData[]) => void;
  className?: string;
  style?: React.CSSProperties;
}

const TabManager = ({
  containers,
  onContainersChange,
  className = "",
  style = {},
}: TabManagerProps) => {
  const handleTabSelect = useCallback(
    (containerId: string, tabId: string) => {
      const updatedContainers = containers.map((container) =>
        container.id === containerId
          ? { ...container, activeTabId: tabId }
          : container
      );
      onContainersChange(updatedContainers);
    },
    [containers, onContainersChange]
  );

  const handleTabClose = useCallback(
    (containerId: string, tabId: string) => {
      const updatedContainers = containers.map((container) => {
        if (container.id === containerId) {
          const filteredTabs = container.tabs.filter((tab) => tab.id !== tabId);
          const newActiveTabId =
            container.activeTabId === tabId
              ? filteredTabs[0]?.id || undefined
              : container.activeTabId;

          return {
            ...container,
            tabs: filteredTabs,
            activeTabId: newActiveTabId,
          };
        }
        return container;
      });
      onContainersChange(updatedContainers);
    },
    [containers, onContainersChange]
  );

  const handleTabMove = useCallback(
    (fromContainerId: string, toContainerId: string, tabId: string) => {
      const updatedContainers = containers.map((container) => {
        if (container.id === fromContainerId) {
          const tabToMove = container.tabs.find((tab) => tab.id === tabId);
          if (!tabToMove) return container;

          const filteredTabs = container.tabs.filter((tab) => tab.id !== tabId);
          const newActiveTabId =
            container.activeTabId === tabId
              ? filteredTabs[0]?.id || undefined
              : container.activeTabId;

          return {
            ...container,
            tabs: filteredTabs,
            activeTabId: newActiveTabId,
          };
        }

        if (container.id === toContainerId) {
          const sourceContainer = containers.find(
            (c) => c.id === fromContainerId
          );
          const tabToMove = sourceContainer?.tabs.find(
            (tab) => tab.id === tabId
          );
          if (!tabToMove) return container;

          return {
            ...container,
            tabs: [...container.tabs, tabToMove],
            activeTabId: tabId,
          };
        }

        return container;
      });
      onContainersChange(updatedContainers);
    },
    [containers, onContainersChange]
  );

  const handleTabAdd = useCallback(
    (containerId: string) => {
      const newTab: TabData = {
        id: `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: `New Tab ${Date.now()}`,
        content: <div>New tab content</div>,
        closable: true,
      };

      const updatedContainers = containers.map((container) =>
        container.id === containerId
          ? {
              ...container,
              tabs: [...container.tabs, newTab],
              activeTabId: newTab.id,
            }
          : container
      );
      onContainersChange(updatedContainers);
    },
    [containers, onContainersChange]
  );

  return (
    <div className={className} style={style}>
      {containers.map((container) => (
        <TabContainer
          key={container.id}
          id={container.id}
          tabs={container.tabs}
          activeTabId={container.activeTabId}
          onTabSelect={handleTabSelect}
          onTabClose={handleTabClose}
          onTabMove={handleTabMove}
          onTabAdd={handleTabAdd}
        />
      ))}
    </div>
  );
};

export default TabManager;
