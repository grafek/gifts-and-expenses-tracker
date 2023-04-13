"use client";
import { useState } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  labelname?: string;
  className?: string;
  required?: boolean;
  error: string | null;
}

const Input = ({
  name,
  className = "",
  labelname,
  required,
  error,
  ...props
}: InputProps) => {
  const requiredAsterisk = required ? (
    <span className="font-semibold text-red-600">*</span>
  ) : null;

  const WITHIN = "top-5 cursor-text px-4";

  const FLOAT = "px-2 top-2 z-20 scale-[0.80]";

  const ERROR_OUTLINE = error?.includes(labelname || "")
    ? "outline-red-600"
    : "outline-gray-700";

  const [labelClasses, setLabelClasses] = useState(FLOAT);

  return (
    <>
      <label
        htmlFor={name}
        className={`${labelClasses} absolute select-none text-xs font-bold uppercase tracking-wide text-gray-500 transition-all duration-300`}
      >
        {labelname} {requiredAsterisk}
      </label>
      <input
        id={name}
        onFocus={() => {
          setLabelClasses(FLOAT);
        }}
        onBlur={(event) => {
          if (event.target.value.trim().length === 0) {
            setLabelClasses(WITHIN);
          }
        }}
        className={`${className} ${ERROR_OUTLINE} mt-1 w-full rounded-md bg-transparent px-3 pb-2 pt-4 outline outline-1 focus:outline-gray-400`}
        {...props}
      />
    </>
  );
};

export default Input;
