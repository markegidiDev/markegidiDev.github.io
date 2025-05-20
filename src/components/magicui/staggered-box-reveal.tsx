"use client";

import { motion, useAnimation, useInView } from "motion/react";
import { useEffect, useRef } from "react";

interface StaggeredBoxRevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  boxColor?: string;
  duration?: number;
  delay?: number;
  index?: number;
}

export const StaggeredBoxReveal = ({
  children,
  width = "fit-content",
  boxColor = "#5046e6",
  duration = 0.5,
  delay = 0,
  index = 0,
}: StaggeredBoxRevealProps) => {
  const mainControls = useAnimation();
  const slideControls = useAnimation();

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    // Calculate staggered delay based on index
    const staggerDelay = delay + (index * 0.2);
    
    if (isInView) {
      // Start content animation with stagger delay
      mainControls.start({
        opacity: 1,
        y: 0,
        transition: { 
          duration: duration, 
          delay: staggerDelay + 0.25 
        }
      });
      
      // Start reveal animation with stagger delay
      slideControls.start({
        left: "100%",
        transition: { 
          duration: duration, 
          delay: staggerDelay,
          ease: "easeIn" 
        }
      });
    }
  }, [isInView, mainControls, slideControls, duration, delay, index]);

  return (
    <div ref={ref} style={{ position: "relative", width, overflow: "hidden" }}>
      <motion.div
        initial={{ opacity: 0, y: 75 }}
        animate={mainControls}
        style={{ opacity: 0 }}
      >
        {children}
      </motion.div>

      <motion.div
        initial={{ left: 0 }}
        animate={slideControls}
        style={{
          position: "absolute",
          top: 4,
          bottom: 4,
          left: 0,
          right: 0,
          zIndex: 20,
          background: boxColor,
        }}
      />
    </div>
  );
};
