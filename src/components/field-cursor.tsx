import { useEffect, useRef } from "react";

export function FieldCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const root = document.documentElement;
    let armed = window.matchMedia("(pointer: fine)").matches;
    if (armed) root.classList.add("fine-cursor");

    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      if (!armed) {
        armed = true;
        root.classList.add("fine-cursor");
      }
      el.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      const over = (event.target as HTMLElement | null)?.closest?.("[data-photo]");
      el.classList.toggle("is-photo", Boolean(over));
    };

    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      root.classList.remove("fine-cursor");
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return <div ref={ref} className="field-cursor" aria-hidden />;
}
