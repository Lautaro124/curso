import React, { forwardRef } from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", ...props }, ref) => {
    const baseStyles = `
      block w-full rounded-md border-gray-300 shadow-sm
      focus:ring-[#7A7CFF] focus:border-[#7A7CFF]  sm:text-sm text-black
    `;

    const errorStyles = error
      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
      : "";

    return (
      <div className="w-full">
        <label
          htmlFor={props.id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
        <textarea
          ref={ref}
          className={`${baseStyles} ${errorStyles} ${className}`.trim()}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
