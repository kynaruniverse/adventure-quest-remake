import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-black uppercase tracking-wider transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_4px_0_0_rgba(0,0,0,0.3)] active:translate-y-1 active:shadow-none",
        destructive: "bg-destructive text-white hover:bg-destructive/90 shadow-[0_4px_0_0_rgba(153,27,27,1)] active:translate-y-1 active:shadow-none",
        outline: "border-2 border-slate-700 bg-transparent shadow-xs hover:bg-slate-800 text-slate-300",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        // NEW: Specific Retro RPG Variant
        retro: "bg-slate-800 border-2 border-slate-600 text-amber-500 shadow-[0_4px_0_0_#020617] hover:bg-slate-700 active:translate-y-1 active:shadow-none transition-all",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-8 rounded-md gap-1.5 px-3",
        lg: "h-14 rounded-xl px-8 text-lg",
        icon: "size-11",
        "icon-sm": "size-8",
        "icon-lg": "size-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);


function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
