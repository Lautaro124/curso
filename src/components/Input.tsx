import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  variant?: "default" | "rounded" | "top" | "bottom" | "middle";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, variant = "default", className = "", ...props }, ref) => {
    const getVariantStyles = () => {
      switch (variant) {
        case "top":
          return "rounded-t-md rounded-b-none";
        case "bottom":
          return "rounded-b-md rounded-t-none";
        case "middle":
          return "rounded-none";
        case "rounded":
          return "rounded-md";
        default:
          return "rounded-md";
      }
    };

    const baseStyles = `
      appearance-none relative block w-full px-3 py-2 
      border border-gray-300 placeholder-gray-500 text-gray-900 
      focus:outline-none focus:ring-[#7A7CFF] focus:border-[#7A7CFF] focus:z-10 
      sm:text-sm
    `;

    const errorStyles = error
      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
      : "";

    return (
      <div className="w-full">
        <label htmlFor={props.id} className="sr-only">
          {label}
        </label>
        <input
          ref={ref}
          className={`${baseStyles} ${getVariantStyles()} ${errorStyles} ${className}`.trim()}
          placeholder={label}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
