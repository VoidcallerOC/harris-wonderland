import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 text-center font-ui text-kicker font-bold uppercase tracking-kicker transition-[color,background-color,border-color,transform,opacity] duration-quick ease-out focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brass disabled:pointer-events-none disabled:opacity-50 active:scale-[0.96] [&_svg]:pointer-events-none [&_svg]:size-4 whitespace-normal sm:whitespace-nowrap",
  {
    variants: {
      variant: {
        brass:
          "bg-brass text-ticket-ink hover:bg-ember hover:text-ticket",
        ghost:
          "border border-brass/50 bg-transparent text-ticket hover:border-brass hover:bg-brass/10",
        ember:
          "bg-ember text-ticket hover:bg-ember-2",
        ticket:
          "bg-ticket text-ticket-ink hover:bg-ticket/90",
        link: "text-brass underline-offset-4 hover:text-ember-2 hover:underline",
      },
      size: {
        default: "min-h-12 px-5 py-3",
        sm: "min-h-11 px-4 py-2.5",
        lg: "min-h-14 px-6 py-3.5",
      },
    },
    defaultVariants: {
      variant: "brass",
      size: "default",
    },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
