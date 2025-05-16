"use client";

import { motion } from "motion/react";
import type { ElementType } from "react";

interface TextAnimateProps {
  /**
   * The text content to animate
   */
  children: string;
  /**
   * The class name to be applied to the component
   */
  className?: string;
  /**
   * The delay before the animation starts
   */
  delay?: number;
  /**
   * The duration of the animation
   */
  duration?: number;
  /**
   * The element type to render
   */
  as?: ElementType;
  /**
   * How to split the text ("text", "word", "character")
   */
  by?: "text" | "word" | "character" | "line";
  /**
   * The animation preset to use
   */
  animation?: "blurInUp" | "fadeIn";
}

export default function TextAnimate({
  as: Component = "p", // Use Component as the tag
  className,
  children,
  delay = 0,
  duration = 0.3,
  by = "word",
  animation = "fadeIn",
}: TextAnimateProps) {
  // Split text into segments based on the 'by' prop
  let segments: string[] = [];
  switch (by) {
    case "word":
      segments = children.split(/(\s+)/);
      break;
    case "character":
      segments = children.split("");
      break;
    case "line":
      segments = children.split("\n");
      break;
    case "text":
    default:
      segments = [children];
      break;
  }

  // Define animation variants based on the animation prop
  const getAnimationProps = () => {
    if (animation === "blurInUp") {
      return {
        initial: { opacity: 0, filter: "blur(10px)", y: 20 },
        animate: { 
          opacity: 1, 
          filter: "blur(0px)", 
          y: 0,
          transition: {
            delay,
            duration: duration
          }
        }
      };
    }
    
    return {
      initial: { opacity: 0, y: 20 },
      animate: { 
        opacity: 1, 
        y: 0,
        transition: {
          delay,
          duration: duration
        }
      }
    };
  };

  const containerProps = {
    className: `whitespace-pre-wrap ${className || ""}`,
    style: { display: "inline-block" }
  };

  // Simplified version that just renders words with animation
  return (
    <Component {...containerProps}>
      {segments.map((segment, i) => (
        <motion.span
          key={`${by}-${i}`}
          {...getAnimationProps()}
          style={{ 
            display: "inline-block",
            whiteSpace: "pre"
          }}
        >
          {segment}
        </motion.span>
      ))}
    </Component>
  );
}
