import React from "react";

interface InputGroupProps {
  children: React.ReactNode;
  className?: string;
}

const InputGroup: React.FC<InputGroupProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`rounded-md shadow-sm -space-y-px ${className}`}>
      {children}
    </div>
  );
};

export default InputGroup;
