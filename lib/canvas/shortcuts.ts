import type { CanvasManager } from "./manager";

function isTypingTarget(el: Element | null): boolean {
  if (!el) return false;
  return (
    el.tagName === "INPUT" ||
    el.tagName === "TEXTAREA" ||
    (el as HTMLElement).isContentEditable
  );
}

export function bindKeyboardShortcuts(
  manager: CanvasManager,
  target: Window = window,
): () => void {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (isTypingTarget(document.activeElement)) return;

    const active = manager.getActiveObject();
    if (active && "isEditing" in active && active.isEditing) return;

    const mod = e.ctrlKey || e.metaKey;
    const key = e.key.toLowerCase();

    if (key === "delete" || key === "backspace") {
      manager.objects.deleteSelected();
    } else if (mod && key === "d") {
      e.preventDefault();
      manager.objects.duplicateSelected();
    } else if (mod && key === "z" && !e.shiftKey) {
      e.preventDefault();
      void manager.undo();
    } else if (mod && (key === "y" || (key === "z" && e.shiftKey))) {
      e.preventDefault();
      void manager.redo();
    } else if (mod && e.altKey && key === "h" && active) {
      // Ctrl/⌘+Alt+H — center horizontally
      e.preventDefault();
      manager.grid.centerObject(active, "horizontal");
      manager.commit();
    } else if (mod && e.altKey && key === "v" && active) {
      // Ctrl/⌘+Alt+V — center vertically
      e.preventDefault();
      manager.grid.centerObject(active, "vertical");
      manager.commit();
    } else if (mod && e.altKey && key === "c" && active) {
      // Ctrl/⌘+Alt+C — center both axes
      e.preventDefault();
      manager.grid.centerObject(active, "both");
      manager.commit();
    }
  };

  target.addEventListener("keydown", handleKeyDown);
  return () => target.removeEventListener("keydown", handleKeyDown);
}
