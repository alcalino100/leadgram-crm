import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-tight transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
        secondary:
          "border-zinc-800 bg-zinc-900 text-zinc-400",
        destructive:
          "border-rose-500/30 bg-rose-500/10 text-rose-400",
        outline:
          "border-zinc-800 text-zinc-400",
        warning:
          "border-amber-500/30 bg-amber-500/10 text-amber-400",
        vip:
          "border-pink-500/40 bg-pink-500/15 text-pink-300 font-semibold shadow-[0_0_10px_rgba(236,72,153,0.2)]",
        success:
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
        blue:
          "border-blue-500/30 bg-blue-500/10 text-blue-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
