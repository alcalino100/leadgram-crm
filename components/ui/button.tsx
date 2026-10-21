import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-cyan-500 text-zinc-950 font-semibold shadow hover:bg-cyan-400 active:bg-cyan-600",
        destructive:
          "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20",
        outline:
          "border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100",
        secondary:
          "bg-zinc-800 text-zinc-100 hover:bg-zinc-700",
        ghost: "hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-100",
        link: "text-cyan-400 underline-offset-4 hover:underline",
        accent: "bg-amber-500 text-zinc-950 font-semibold hover:bg-amber-400",
      },
      size: {
        default: "h-8 px-3 py-1.5",
        sm: "h-7 rounded px-2.5 text-[11px]",
        lg: "h-10 rounded-md px-6 text-sm",
        icon: "h-8 w-8",
        iconSm: "h-7 w-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
