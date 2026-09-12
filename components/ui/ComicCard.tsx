import * as React from "react"
import { cn } from "@/lib/utils"

export interface ComicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  tilted?: boolean
  bgVariant?: "default" | "primary" | "secondary" | "warning" | "dark"
}

const ComicCard = React.forwardRef<HTMLDivElement, ComicCardProps>(
  ({ className, tilted = false, bgVariant = "default", children, ...props }, ref) => {
    
    const backgrounds = {
      default: "bg-[#111118] text-white",
      primary: "bg-[var(--primary)] text-black",
      secondary: "bg-[var(--secondary)] text-black",
      warning: "bg-[var(--comic-yellow)] text-black",
      dark: "bg-[var(--bg-dark)] text-white"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "comic-border comic-shadow p-6 relative overflow-hidden",
          backgrounds[bgVariant],
          tilted && "rotate-[-2deg] hover:rotate-0 transition-transform duration-300",
          className
        )}
        {...props}
      >
        {/* Optional halftone pattern overlay for comic effect */}
        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay" 
             style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '8px 8px' }} 
        />
        
        <div className="relative z-10">
          {children}
        </div>
      </div>
    )
  }
)
ComicCard.displayName = "ComicCard"

export { ComicCard }
