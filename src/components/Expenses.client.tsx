"use client";
import { type Expense } from "@/types";
import { MONTHS, YEARS } from "@/globals";
import React, { Dispatch, SetStateAction, use, useMemo, useState } from "react";
import Input from "./Input.client";
import Button from "./Button.client";
import Select from "./Select.client";
import withAuth from "@/hoc/withAuth";
import { ChartSkeleton, Spinner } from "./Loaders.server";
import { addExpense, auth, getExpenses } from "@/lib/firebase";

const ExpensesChart: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString("default", { month: "long" })
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [isAdded, setIsAdded] = useState(false);

  const [showForm, setShowForm] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const promise = useMemo(() => getExpenses(auth.currentUser?.uid!), [isAdded]);

  const expenses = use(promise);

  const filteredExpenses = expenses.filter((expense) => {
    if (selectedYear && selectedMonth) {
      return expense.year === selectedYear && expense.month === selectedMonth;
    } else if (selectedYear) {
      return expense.year === selectedYear;
    } else if (selectedMonth) {
      return expense.month === selectedMonth;
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

  if (!expenses) return <ChartSkeleton />;

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
      {showForm ? <ExpenseForm setIsAdded={setIsAdded} /> : null}
      <div className="mx-auto mt-4 min-h-full max-w-3xl rounded-lg bg-black shadow-md">
        <div className="flex items-center justify-between border-b border-gray-700 p-4">
          <h3 className="font-medium ">Total Expenses: ${totalExpenses}</h3>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-5">
            <Select
              options={YEARS}
              value={selectedYear}
              onChange={async (e) => {
                setSelectedYear(Number(e.target.value));
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
            className={`min-w-full w-${expenses.length * 50 + 10}`}
            height={"420"}
          >
            {filteredExpenses.map((data, index) => (
              <rect
                key={data.id}
                x={index * 50 + 20}
                y={400 - (data.value / maxAmount) * 380}
                height={(data.value / maxAmount) * 380}
                className={`w-7 ${
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
                x={index * 50 + 35}
                y={400 - (data.value / maxAmount) * 380 - 8}
                className={`fill-[#bbb] text-[12px]`}
                textAnchor="middle"
              >
                {data.name}
              </text>
            ))}
            {filteredExpenses.map((data, index) => (
              <text
                key={data.id}
                x={index * 50 + 35}
                y={414}
                className={`fill-[#bbb] text-[11px] tracking-wider`}
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
  setIsAdded: Dispatch<SetStateAction<boolean>>;
};

const ExpenseForm: React.FC<ExpenseFormProps> = ({ setIsAdded }) => {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [month, setMonth] = useState(
    new Date().toLocaleString("default", { month: "long" })
  );
  const [year, setYear] = useState(new Date().getFullYear());

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: any) => {
    setIsAdded(false);
    setError(null);
    event.preventDefault();
    if (name.length < 1) {
      setError("Name cannot be empty!");
      return;
    } else if (value.length < 1 || Number(value) < 1) {
      setError("Value cannot be empty or =<0!");
      return;
    }
    setLoading(true);

    const error = await addExpense(auth.currentUser?.uid!, {
      name,
      value: Number(value),
      month: month as Expense["month"],
      year: Number(year),
    });

    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    setName("");
    setValue("");
    setIsAdded(true);
  };

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
          value={name}
          error={error}
          labelname="Name"
          onChange={(e) => {
            setName(e.target.value);
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
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(null);
          }}
        />
      </div>

      <div className="relative">
        <Select
          options={MONTHS}
          value={month}
          onChange={(e) => setMonth(e.target.value as Expense["month"])}
        />
      </div>
      <div className="relative">
        <Select
          options={YEARS}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
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
