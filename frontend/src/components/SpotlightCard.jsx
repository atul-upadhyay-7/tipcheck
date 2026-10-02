import { useRef } from "react";

// Original lightweight spotlight card, inspired by React Bits' modular approach.
// No borrowed component source and no WebGL or remote assets.
export default function SpotlightCard({ children, className = "" }) {
  const card = useRef(null);
  function track(event) {
    if (event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    card.current.style.setProperty(
      "--spot-x",
      `${event.clientX - rect.left}px`,
    );
    card.current.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  }
  return (
    <div
      ref={card}
      onPointerMove={track}
      className={`spotlight-card ${className}`}
    >
      {children}
    </div>
  );
}
