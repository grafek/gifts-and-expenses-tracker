import withAuth from "@/hoc/withAuth";
import { Spinner } from "./Loaders.server";
import Button from "./Button.client";
import Input from "./Input.client";
import { type Expense } from "@/types";
import { useCallback, useState } from "react";

type ExpenseFormProps = {
  submitHandler: (expense: Expense) => Promise<void>;
  defaultValues?: Expense;
};

const INITIAL_EXPENSE = {
  name: "",
  value: "" as unknown as number,
  date: new Date().toISOString().slice(0, 10),
};

const MAX_NAME_LENGTH = 15;

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  submitHandler,
  defaultValues,
}) => {
  const [expense, setExpense] = useState<Expense>(
    defaultValues ?? INITIAL_EXPENSE
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (event: any) => {
      event.preventDefault();

      setError(null);

      if (expense.name.trim().length < 1) {
        setError("Name cannot be empty!");
        return;
      } else if (expense.name.trim().length > MAX_NAME_LENGTH) {
        setError(`Name cannot be longer than ${MAX_NAME_LENGTH} characters!`);
        return;
      } else if (Number(expense.value) < 1) {
        setError("Value cannot be less than a 0!");
        return;
      }
      setLoading(true);

      await submitHandler(expense);

      setExpense(INITIAL_EXPENSE);
    },
    [expense, submitHandler]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex max-w-xl flex-col gap-4 py-6"
    >
      <div className="relative">
        <Input
          required
          type="text"
          name="Expense Name"
          value={expense.name}
          error={error}
          labelname="Name"
          onChange={(e) => {
            setExpense({ ...expense, name: e.target.value });
            setError(null);
          }}
        />
        <span
          className={`absolute bottom-1 right-2 text-xs ${
            expense.name.trim().length > MAX_NAME_LENGTH
              ? "text-red-600"
              : "text-[#888]"
          }`}
        >
          {expense.name.trim().length}/{MAX_NAME_LENGTH}
        </span>
      </div>
      <div className="relative">
        <Input
          required
          type="number"
          name="Expense Value"
          labelname="Value"
          error={error}
          value={expense.value}
          onChange={(e) => {
            setExpense({ ...expense, value: Number(e.target.value) });
            setError(null);
          }}
        />
      </div>
      <div className="relative">
        <Input
          required
          onClick={(e) => e.currentTarget.showPicker()}
          type="date"
          name="expense date"
          labelname="Date"
          error={error}
          value={expense.date.toString()}
          onChange={(e) => {
            setExpense({
              ...expense,
              date: new Date(e.target.value).toISOString().slice(0, 10),
            });
            setError(null);
          }}
        />
      </div>
      <Button
        type="submit"
        title="submit"
        disabled={loading ? true : false}
        className="btn-primary mx-auto mt-2 flex w-fit items-center gap-3"
      >
        <span className="flex-1">Submit</span>
        {loading ? <Spinner /> : null}
      </Button>
      {error && (
        <p className="text-red-600" role="alert">
          {error}
        </p>
      )}
    </form>
  );
};

export default withAuth(ExpenseForm);
