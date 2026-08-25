import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

export const controlClass =
  "w-full rounded-control border border-slate-200 bg-white px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-4 focus:ring-brand/10";
export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className = "", ...props }, ref) => (
  <input ref={ref} className={`${controlClass} ${className}`} {...props} />
));
Input.displayName = "Input";
