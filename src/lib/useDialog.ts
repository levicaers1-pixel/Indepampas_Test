import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Keyboard behaviour for a modal dialog: focus moves into it, Tab stays inside, Escape closes it
 * and focus returns to whatever opened it. Put the returned ref and tabIndex={-1} on the dialog.
 * `initial` is an optional selector for the element that should receive focus first; `active`
 * is for dialogs that are always mounted and only sometimes shown.
 */
export function useDialog<T extends HTMLElement>(onClose: () => void, initial?: string, active = true) {
  const ref = useRef<T>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const node = ref.current;
    if (!active || !node) return;
    const opener = document.activeElement as HTMLElement | null;
    const items = () => [...node.querySelectorAll<HTMLElement>(FOCUSABLE)];
    (initial ? node.querySelector<HTMLElement>(initial) : null)?.focus();
    if (!node.contains(document.activeElement)) (items()[0] ?? node).focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const list = items();
      if (list.length === 0) {
        e.preventDefault();
        return;
      }
      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !node!.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !node!.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (opener && document.contains(opener)) opener.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return ref;
}
