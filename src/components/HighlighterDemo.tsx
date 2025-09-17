import { Highlighter } from "@/components/magicui/highlighter";

export function HighlighterDemo() {
  return (
    <div className="p-8 space-y-6 bg-card rounded-xl border border-border">
      <h3 className="text-2xl font-bold text-foreground mb-6">Highlighter Component Showcase</h3>
      
      <div className="space-y-4">
        <p className="text-lg">
          This is a{" "}
          <Highlighter action="highlight" color="#3B82F6" iterations={3} animationDuration={800} isView={true}>
            highlight effect
          </Highlighter>{" "}
          with multiple iterations and view-based animation.
        </p>
        
        <p className="text-lg">
          Here's an{" "}
          <Highlighter action="underline" color="#EF4444" strokeWidth={3}>
            underline annotation
          </Highlighter>{" "}
          with custom stroke width.
        </p>
        
        <p className="text-lg">
          This text has a{" "}
          <Highlighter action="circle" color="#8B5CF6" strokeWidth={2} isView={true}>
            circle annotation
          </Highlighter>{" "}
          that animates on scroll.
        </p>
        
        <p className="text-lg">
          A{" "}
          <Highlighter action="box" color="#10B981" strokeWidth={2.5} iterations={2} isView={true}>
            box annotation
          </Highlighter>{" "}
          with sketchy effect from multiple iterations.
        </p>
        
        <p className="text-lg">
          Text with{" "}
          <Highlighter action="bracket" color="#F59E0B" strokeWidth={2} isView={true}>
            bracket annotations
          </Highlighter>{" "}
          for emphasis.
        </p>
        
        <p className="text-lg">
          <Highlighter action="crossed-off" color="#EF4444" strokeWidth={2}>
            Crossed-off text
          </Highlighter>{" "}
          and{" "}
          <Highlighter action="strike-through" color="#6B7280" strokeWidth={2}>
            strike-through text
          </Highlighter>{" "}
          for different effects.
        </p>
      </div>
    </div>
  );
}
