"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface TypingAnimationProps {
  children: string;
  className?: string;
  duration?: number;
  startOnView?: boolean;
}

export function TypingAnimation({
  children,
  className,
  duration = 200,
  startOnView = false,
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [i, setI] = useState(0);
  const [isInView, setIsInView] = useState(!startOnView);

  useEffect(() => {
    if (!isInView) return;

    const typingEffect = setInterval(() => {
      if (i < children.length) {
        setDisplayedText((prevState) => prevState + children.charAt(i));
        setI(i + 1);
      } else {
        clearInterval(typingEffect);
      }
    }, duration);

    return () => {
      clearInterval(typingEffect);
    };
  }, [duration, i, children, isInView]);

  return (
    <motion.h1
      className={cn(
        "font-display text-center text-4xl font-bold leading-[5rem] tracking-[-0.02em] text-black dark:text-white",
        className,
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onViewportEnter={() => startOnView && setIsInView(true)}
    >
      {displayedText ? displayedText : children}
    </motion.h1>
  );
}