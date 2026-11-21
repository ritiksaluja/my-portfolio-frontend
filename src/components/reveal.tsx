import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "fade" | "scale";
}

export function Reveal({ children, className, delay = 0, direction = "up" }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  const base = "transition-all duration-700 ease-out";
  const hidden: Record<string, string> = {
    up:    "opacity-0 translate-y-8",
    down:  "opacity-0 -translate-y-8",
    left:  "opacity-0 translate-x-8",
    right: "opacity-0 -translate-x-8",
    fade:  "opacity-0",
    scale: "opacity-0 scale-95",
  };
  const visible: Record<string, string> = {
    up:    "opacity-100 translate-y-0",
    down:  "opacity-100 translate-y-0",
    left:  "opacity-100 translate-x-0",
    right: "opacity-100 translate-x-0",
    fade:  "opacity-100",
    scale: "opacity-100 scale-100",
  };

  return (
    <div
      ref={ref}
      className={cn(base, inView ? visible[direction] : hidden[direction], className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
