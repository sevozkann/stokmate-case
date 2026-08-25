import { forwardRef, useState } from "react";
import type { InputHTMLAttributes } from "react";
import { controlClass } from "./Input";

export const PasswordInput = forwardRef<
  HTMLInputElement,
  Omit<InputHTMLAttributes<HTMLInputElement>, "type">
>(({ className = "", ...props }, ref) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        ref={ref}
        className={`${controlClass} pr-11 ${className}`}
        type={visible ? "text" : "password"}
        {...props}
      />

      <button
        type="button"
        className="absolute inset-y-0 right-0 grid w-11 place-items-center text-slate-400 transition hover:text-brand"
        aria-label={visible ? "Şifreyi gizle" : "Şifreyi göster"}
        aria-pressed={visible}
        onClick={() => setVisible((current) => !current)}
      >
        {visible ? (
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="m3 3 18 18" />
            <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
            <path d="M9.9 4.2A10.7 10.7 0 0 1 12 4c5.5 0 9.5 5 9.5 8a11.8 11.8 0 0 1-2.1 3.7M6.6 6.6C4.3 8.1 2.5 10.3 2.5 12c0 3 4 8 9.5 8a9.4 9.4 0 0 0 3.4-.6" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M2.5 12S6.5 4 12 4s9.5 8 9.5 8-4 8-9.5 8-9.5-8-9.5-8Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";
