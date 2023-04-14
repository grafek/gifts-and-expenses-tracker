"use client";

import { MONTHS, YEARS } from "@/globals";
import { useCallback, useEffect, useState } from "react";
import Input from "./Input.client";
import Button from "./Button.client";
import Select from "./Select.client";
import withAuth from "@/hoc/withAuth";
import { Spinner } from "./Loaders.server";
import { addExpense, auth, getExpenses } from "@/lib/firebase";
import { type Expense } from "@/types";

const ExpensesChart: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString("default", { month: "long" })
  );
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [showForm, setShowForm] = useState(false);

  const handleAddExpense = useCallback(async (expense: Expense) => {
    await addExpense(auth.currentUser?.uid!, expense);

    const updatedExpenses = await getExpenses(auth.currentUser?.uid!);
    setExpenses(updatedExpenses);
    setShowForm(false);
  }, []);

  const fetchExpenses = useCallback(async () => {
    const expensesData = await getExpenses(auth.currentUser?.uid!);
    setExpenses(expensesData);
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const filteredExpenses = expenses.filter((expense) => {
    if (selectedYear && selectedMonth) {
      return expense.year == selectedYear && expense.month == selectedMonth;
    } else if (selectedYear) {
      return expense.year == selectedYear;
    } else if (selectedMonth) {
      return expense.month == selectedMonth;
    } else {
      return true;
    }
  });

  const maxAmount = Math.max(
    ...filteredExpenses.map((expense) => expense.value)
  );

  const totalExpenses = filteredExpenses.reduce(
    (acc, expense) => acc + expense.value,
    0
  );

  const CHART_HEIGHT = 567;
  const BAR_WIDTH = 40;

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Expenses Chart</h2>
        <Button
          type="submit"
          onClick={() => setShowForm((prev) => !prev)}
          className="bg-transparent px-4 py-2 text-lg outline outline-1 outline-gray-700 hover:bg-gray-300 hover:text-black"
        >
          Add Expense
        </Button>
      </div>
      {showForm ? <ExpenseForm onHandleAdd={handleAddExpense} /> : null}
      <div className="mx-auto mt-4 h-[90%] max-w-6xl rounded-lg bg-black shadow-md">
        <div className="flex items-center justify-between border-b border-gray-700 p-4">
          <h3 className="font-medium ">Total Expenses: ${totalExpenses}</h3>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-5">
            <Select
              options={YEARS}
              value={selectedYear}
              onChange={async (e) => {
                setSelectedYear(e.target.value);
              }}
            />
            <Select
              options={MONTHS}
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <svg
            className={`min-w-full`}
            width={`${expenses.length * 60 + 10}`}
            height={CHART_HEIGHT}
          >
            {filteredExpenses.map((data, index) => (
              <rect
                key={data.id}
                x={index * 60 + 20}
                y={
                  CHART_HEIGHT -
                  20 -
                  (data.value / maxAmount) * (CHART_HEIGHT - 50)
                }
                height={(data.value / maxAmount) * (CHART_HEIGHT - 50)}
                className={`w-10 ${
                  data.value === maxAmount ? "fill-red-700" : "fill-blue-700"
                }`}
                rx="5"
              >
                <title>{`$${data.value}`}</title>
              </rect>
            ))}
            {filteredExpenses.map((data, index) => (
              <text
                key={data.id}
                x={index * 60 + BAR_WIDTH}
                y={
                  CHART_HEIGHT -
                  20 -
                  (data.value / maxAmount) * (CHART_HEIGHT - 50) -
                  8
                }
                className={`fill-[#bbb] text-[12px]`}
                textAnchor="middle"
              >
                {data.name}
              </text>
            ))}
            {filteredExpenses.map((data, index) => (
              <text
                key={data.id}
                x={index * 60 + BAR_WIDTH}
                y={CHART_HEIGHT - 4}
                className={`fill-[#f5f5f5] text-[12px] font-semibold tracking-wider`}
                textAnchor="middle"
              >
                {`$${data.value}`}
              </text>
            ))}
          </svg>
        </div>
      </div>
    </>
  );
};
ExpensesChart.displayName = "Expenses";

export default withAuth(ExpensesChart);

type ExpenseFormProps = {
  onHandleAdd: (expense: Expense) => Promise<void>;
};

const INITIAL_EXPENSE = {
  name: "",
  value: "" as unknown as number,
  month: new Date().toLocaleString("default", { month: "long" }),
  year: new Date().getFullYear().toString(),
};

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onHandleAdd }) => {
  const [expense, setExpense] = useState<Expense>(INITIAL_EXPENSE);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (event: any) => {
      event.preventDefault();

      setError(null);

      if (expense.name.length < 1) {
        setError("Name cannot be empty!");
        return;
      } else if (Number(expense.value) < 1) {
        setError("Value cannot be less than a 0!");
        return;
      }
      setLoading(true);

      await onHandleAdd(expense);

      setExpense(INITIAL_EXPENSE);
    },
    [expense, onHandleAdd]
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
        className="relative flex w-full items-center justify-center px-4 py-2 text-lg outline outline-1 outline-gray-700 transition-colors duration-300 hover:bg-white/90 hover:text-black"
      >
        <span className="flex-1"> Add expense</span>
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
