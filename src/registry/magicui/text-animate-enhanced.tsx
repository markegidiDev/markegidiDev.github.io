"use client";

import { motion } from "motion/react";
import type { ElementType, ReactNode } from "react";

// Split text function that works with strings
function splitText(text: string, by: "text" | "word" | "character" | "line"): string[] {
  switch (by) {
    case "word":
      return text.split(/(\s+)/);
    case "character":
      return text.split("");
    case "line":
      return text.split("\n");
    case "text":
    default:
      return [text];
  }
}

interface TextAnimateEnhancedProps {
  /**
   * The content to animate - can be string or ReactNode
   */
  children: ReactNode;
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
   * How to split the text ("text", "word", "character") - only applies to string children
   */
  by?: "text" | "word" | "character" | "line";
  /**
   * The animation preset to use
   */
  animation?: "blurInUp" | "fadeIn";
}

export function TextAnimateEnhanced({
  children,
  delay = 0,
  duration = 0.3,
  className,
  as: Component = "div",
  by = "word",
  animation = "fadeIn",
}: TextAnimateEnhancedProps) {
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

  // Check if children is a string
  if (typeof children === 'string') {
    // Split text into segments based on the 'by' prop
    const segments = splitText(children, by);
    
    return (
      <Component className={className || ''}>
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
  } else {
    // For React nodes, animate the entire content as one unit
    return (
      <motion.div 
        className={className || ''} 
        {...getAnimationProps()}
      >
        {children}
      </motion.div>
    );
  }
}
