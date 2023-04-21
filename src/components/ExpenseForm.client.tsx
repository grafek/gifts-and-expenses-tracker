import withAuth from "@/hoc/withAuth";
import { Spinner } from "./Loaders.server";
import Button from "./Button.client";
import Select from "./Select.client";
import Input from "./Input.client";
import { type Expense } from "@/types";
import { useCallback, useState } from "react";
import { MONTHS, YEARS } from "@/globals";

type ExpenseFormProps = {
  submitHandler: (expense: Expense) => Promise<void>;
  defaultValues?: Expense;
};

const INITIAL_EXPENSE = {
  name: "",
  value: "" as unknown as number,
  month: new Date().toLocaleString("default", { month: "long" }),
  year: new Date().getFullYear().toString(),
};

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
          name="name"
          value={expense.name}
          error={error}
          labelname="Name"
          onChange={(e) => {
            setExpense({ ...expense, name: e.target.value });
            setError(null);
          }}
        />
      </div>
      <div className="relative">
        <Input
          required
          type="number"
          name="value"
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
        <Select
          options={MONTHS}
          value={expense.month}
          onChange={(e) => setExpense({ ...expense, month: e.target.value })}
        />
      </div>
      <div className="relative">
        <Select
          options={YEARS}
          value={expense.year}
          onChange={(e) => setExpense({ ...expense, year: e.target.value })}
        />
      </div>
      <Button
        type="submit"
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
