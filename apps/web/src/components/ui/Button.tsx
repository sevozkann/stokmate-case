import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
const styles: Record<Variant, string> = {
  primary: "bg-brand text-white shadow-lg shadow-brand/20 hover:bg-brand-hover",
  secondary: "border border-line bg-white text-slate-700 hover:bg-slate-50",
  ghost: "text-slate-600 hover:bg-slate-100",
};

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
}) {
  return (
    <button
      className={`rounded-control px-4 py-2.5 text-sm font-bold transition ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
