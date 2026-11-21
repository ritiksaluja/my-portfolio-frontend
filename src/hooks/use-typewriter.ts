import { useEffect, useState } from "react";

type Phase = "typing" | "pausing" | "deleting" | "waiting";

interface Options {
  /** Characters per second while typing */
  typeSpeed?: number;
  /** Characters per second while deleting */
  deleteSpeed?: number;
  /** ms to wait after fully typed before deleting */
  pauseAfterType?: number;
  /** ms to wait after fully deleted before retyping */
  pauseAfterDelete?: number;
  /** ms before the very first character appears */
  startDelay?: number;
  /** Loop forever (default true) */
  loop?: boolean;
}

export function useTypewriter(
  text: string,
  {
    typeSpeed = 4,
    deleteSpeed = 8,
    pauseAfterType = 1800,
    pauseAfterDelete = 700,
    startDelay = 500,
    loop = true,
  }: Options = {},
) {
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<Phase>("waiting");

  useEffect(() => {
    setDisplayed("");
    setPhase("waiting");

    // Initial delay before first character
    const init = setTimeout(() => setPhase("typing"), startDelay);
    return () => clearTimeout(init);
  }, [text, startDelay]);

  useEffect(() => {
    if (phase === "waiting") return;

    if (phase === "typing") {
      if (displayed.length >= text.length) {
        // Fully typed — pause then start deleting
        const t = setTimeout(() => setPhase("pausing"), pauseAfterType);
        return () => clearTimeout(t);
      }
      const t = setTimeout(
        () => setDisplayed(text.slice(0, displayed.length + 1)),
        1000 / typeSpeed,
      );
      return () => clearTimeout(t);
    }

    if (phase === "pausing") {
      const t = setTimeout(() => setPhase("deleting"), 0);
      return () => clearTimeout(t);
    }

    if (phase === "deleting") {
      if (displayed.length === 0) {
        if (!loop) return;
        // Fully deleted — wait then retype
        const t = setTimeout(() => setPhase("typing"), pauseAfterDelete);
        return () => clearTimeout(t);
      }
      const t = setTimeout(
        () => setDisplayed((prev) => prev.slice(0, -1)),
        1000 / deleteSpeed,
      );
      return () => clearTimeout(t);
    }
  }, [phase, displayed, text, typeSpeed, deleteSpeed, pauseAfterType, pauseAfterDelete, loop]);

  const isTyping = phase === "typing";
  const isDeleting = phase === "deleting";

  return { displayed, isTyping, isDeleting };
}
