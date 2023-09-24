export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: string[];
  labelname?: string;
  className?: string;
  required?: boolean;
}

const Select = ({
  name,
  className = "",
  options,
  required,
  labelname,
  ...props
}: SelectProps) => {
  const requiredAsterisk = required ? (
    <span className="font-semibold text-red-500">*</span>
  ) : null;

  return (
    <label htmlFor={name}>
      {labelname} {requiredAsterisk}
      <select
        id={name}
        className={`${className} w-full rounded-md bg-transparent px-3 py-1 outline outline-1 outline-gray-700 focus:outline-gray-400 md:py-2`}
        {...props}
      >
        {options?.map((option) => (
          <option
            key={option}
            value={option}
            className="appearance-none bg-black hover:bg-gray-800"
          >
            {option}
          </option>
        ))}
      </select>
    </label>
  );
};
export default Select;
