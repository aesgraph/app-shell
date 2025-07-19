import { themes } from "../themes/themes";
import { ThemeColors } from "../types/ThemeDefinition";

describe("Theme Workspace Color Migration", () => {
  const requiredWorkspaceColors: (keyof ThemeColors)[] = [
    "workspaceBackground",
    "workspacePanel",
    "workspaceTitleBackground",
    "workspaceTitleText",
    "workspaceResizer",
    "workspaceResizerHover",
    "workspaceScrollbar",
    "workspaceScrollbarHover",
  ];

  test("All themes should have workspace-specific colors", () => {
    Object.entries(themes).forEach(([, theme]) => {
      requiredWorkspaceColors.forEach((colorKey) => {
        expect(theme.colors[colorKey]).toBeDefined();
        expect(typeof theme.colors[colorKey]).toBe("string");
        expect(theme.colors[colorKey]).toMatch(/^#[0-9a-fA-F]{6}$/); // Valid hex color
      });
    });
  });

  test("Each theme should have unique workspace colors", () => {
    const themeEntries = Object.entries(themes);

    // Test that themes have different workspace backgrounds (not all using same color)
    const backgrounds = themeEntries.map(
      ([, theme]) => theme.colors.workspaceBackground
    );
    const uniqueBackgrounds = new Set(backgrounds);

    // Should have at least some variety in workspace backgrounds
    expect(uniqueBackgrounds.size).toBeGreaterThan(1);
  });

  test("Workspace colors should be valid hex colors", () => {
    Object.entries(themes).forEach(([, theme]) => {
      requiredWorkspaceColors.forEach((colorKey) => {
        const color = theme.colors[colorKey];
        expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
    });
  });

  test("All expected themes are present", () => {
    const expectedThemes = [
      "light",
      "dark",
      "dracula",
      "oneDark",
      "solarized",
      "monokai",
      "nord",
      "gruvbox",
      "tokyo",
      "catppuccin",
    ];

    expectedThemes.forEach((themeId) => {
      expect(themes[themeId]).toBeDefined();
      expect(themes[themeId].colors).toBeDefined();
    });
  });
});
