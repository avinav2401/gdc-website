import * as React from "react"
import { cn } from "@/lib/utils"

export interface ComicButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "warning" | "outline"
  size?: "sm" | "md" | "lg"
}

const ComicButton = React.forwardRef<HTMLButtonElement, ComicButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-display uppercase tracking-wider comic-border comic-shadow-sm comic-hover active:comic-shadow-none"
    
    const variants = {
      primary: "bg-[var(--primary)] text-white",
      secondary: "bg-[var(--secondary)] text-black",
      warning: "bg-[var(--comic-yellow)] text-black",
      outline: "bg-transparent text-white"
    }
    
    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-12 px-6 text-xl",
      lg: "h-16 px-10 text-3xl"
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    )
  }
)
ComicButton.displayName = "ComicButton"

export { ComicButton }
