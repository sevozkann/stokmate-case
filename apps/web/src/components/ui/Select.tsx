import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";
import { controlClass } from "./Input";

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(({ className = "", children, ...props }, ref) => (
  <select
    ref={ref}
    className={`${controlClass} cursor-pointer ${className}`}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";
