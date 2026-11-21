import { useEffect, useState } from "react";
import { useInView } from "@/hooks/use-in-view";

interface CountUpProps {
  value: string;
  duration?: number;
}

export function CountUp({ value, duration = 1200 }: CountUpProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [count, setCount] = useState(0);

  // Extract digits and suffix (e.g., "99%" -> target = 99, suffix = "%")
  const numericStr = value.replace(/[^0-9]/g, "");
  const target = parseInt(numericStr, 10) || 0;
  const suffix = value.replace(/[0-9]/g, "");

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const end = target;
    if (start === end) {
      setCount(end);
      return;
    }

    const totalSteps = 60;
    const stepTime = duration / totalSteps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / totalSteps;
      // Ease out quad animation curve
      const easeProgress = progress * (2 - progress);
      const nextVal = Math.round(easeProgress * end);
      
      setCount(nextVal);

      if (currentStep >= totalSteps) {
        setCount(end);
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return (
    <div ref={ref} className="inline-block">
      {count}
      {suffix}
    </div>
  );
}
