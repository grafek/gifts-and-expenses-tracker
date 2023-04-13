interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
  isRounded?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  className = "",
  children,
  isRounded,
  ...props
}) => {
  return (
    <button
      {...props}
      className={`select-none font-semibold shadow-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
        isRounded ? "rounded-full" : "rounded-md"
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
