import { useEffect, useRef } from "react";

export function FieldCursor() {
  const coreRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const core = coreRef.current;
    const trail = trailRef.current;
    if (!core || !trail) return;

    const root = document.documentElement;
    let armed = window.matchMedia("(pointer: fine)").matches;
    if (armed) root.classList.add("fine-cursor");

    let tx = -40;
    let ty = -40;
    let x = -40;
    let y = -40;
    let raf = 0;
    let looping = false;

    const tick = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      trail.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (Math.abs(tx - x) + Math.abs(ty - y) > 0.15) {
        raf = requestAnimationFrame(tick);
      } else {
        looping = false;
      }
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      if (!armed) {
        armed = true;
        root.classList.add("fine-cursor");
      }
      tx = event.clientX;
      ty = event.clientY;
      core.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      const node = event.target as HTMLElement | null;
      const overPhoto = Boolean(node?.closest?.("[data-photo]"));
      const overHot = Boolean(
        node?.closest?.("a, button, [role='button'], input, label, summary, select"),
      );
      core.classList.toggle("is-photo", overPhoto);
      core.classList.toggle("is-hot", overHot && !overPhoto);
      trail.classList.toggle("is-photo", overPhoto);
      trail.classList.toggle("is-hot", overHot && !overPhoto);
      if (!looping) {
        looping = true;
        raf = requestAnimationFrame(tick);
      }
    };

    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      root.classList.remove("fine-cursor");
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={trailRef} className="field-cursor-trail" aria-hidden style={{ transform: "translate3d(-80px,-80px,0)" }} />
      <div ref={coreRef} className="field-cursor" aria-hidden style={{ transform: "translate3d(-80px,-80px,0)" }}>
        <span className="field-cursor-pip" />
      </div>
    </>
  );
}
