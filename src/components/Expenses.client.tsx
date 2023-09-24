"use client";

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import Button from "./Button.client";
import Select from "./Select.client";
import withAuth from "@/hoc/withAuth";
import ExpenseForm from "./ExpenseForm.client";
import { addExpense, auth, getExpenses, removeExpense } from "@/lib/firebase";
import { type Expense } from "@/types";
import Link from "next/link";
import {
  CURRENT_MONTH,
  CURRENT_YEAR,
  LONG_MONTHS_FORMATTER,
  MONTHS,
  YEARS,
} from "@/globals";
import Image from "next/image";

const CHART_HEIGHT = 400;
const BAR_WIDTH = 40;

const ExpensesChart: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(CURRENT_MONTH);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(false);

  const handleAddExpense = useCallback(async (expense: Expense) => {
    await addExpense(auth.currentUser?.uid!, expense);

    const updatedExpenses = await getExpenses(auth.currentUser?.uid!);
    setExpenses(updatedExpenses);
    setShowForm(false);
  }, []);

  const handleRemoval = useCallback(async (expense: Expense) => {
    await removeExpense(auth.currentUser?.uid!, expense);

    const updatedExpenses = await getExpenses(auth.currentUser?.uid!);
    setExpenses(updatedExpenses);
  }, []);

  const fetchExpenses = useCallback(async () => {
    const expensesexpense = await getExpenses(auth.currentUser?.uid!);
    setExpenses(expensesexpense);
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const filteredExpenses = useMemo(
    () =>
      expenses.filter((expense) => {
        if (selectedYear && selectedMonth) {
          return (
            new Date(expense.date).getFullYear().toString() == selectedYear &&
            new Date(expense.date).toLocaleString("default", {
              month: "short",
            }) == selectedMonth
          );
        } else if (selectedYear) {
          return (
            new Date(expense.date).getFullYear().toString() == selectedYear
          );
        } else if (selectedMonth) {
          return new Date(expense.date).toLocaleString("default", {
            month: "short",
          });
        } else {
          return true;
        }
      }),
    [expenses, selectedMonth, selectedYear],
  );

  const maxAmount = Math.max(
    ...filteredExpenses.map((expense) => expense.value),
  );

  const totalExpenses = filteredExpenses.reduce(
    (acc, expense) => acc + expense.value,
    0,
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <Button
          type="button"
          onClick={() => setShowForm((prev) => !prev)}
          className="btn-transparent flex min-w-[155px] items-center gap-2"
        >
          <Image src={"/icons/add.svg"} alt="add-icon" width={24} height={24} />
          Add Expense
        </Button>
        {filteredExpenses.length ? (
          <Button
            type="button"
            onClick={() => {
              setShowList((prev) => !prev);
              setShowForm((prev) => (prev ? (prev = false) : prev));
            }}
            className="btn-transparent flex min-w-[155px] items-center gap-2"
          >
            {!showList ? (
              <Image
                src={"/icons/edit.svg"}
                alt="edit-icon"
                width={24}
                height={24}
              />
            ) : (
              <Image
                src={"/icons/chart.svg"}
                alt="bin-icon"
                width={24}
                height={24}
              />
            )}
            {showList ? "Show Chart" : "Edit Expenses"}
          </Button>
        ) : null}
      </div>

      {showForm ? <ExpenseForm submitHandler={handleAddExpense} /> : null}

      <div className="h-[90%] flex-1 rounded-lg bg-black">
        <div className="flex items-center justify-between border-b border-gray-700 p-4">
          <h3 className="font-medium">Total Expenses: ${totalExpenses}</h3>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            <Select
              options={YEARS}
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            />
            <Select
              options={MONTHS}
              value={selectedMonth}
              className="w-fit"
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </div>
        </div>

        {!filteredExpenses.length ? (
          <div className="py-4 text-center">
            No expenses recorded for {selectedMonth} {selectedYear}
          </div>
        ) : showList ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto overflow-x-scroll text-sm">
              <thead className="bg-[#222] text-xs uppercase">
                <tr className="[&>th]:px-6 [&>th]:py-3">
                  <th scope="col">Expense</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Month</th>
                  <th scope="col">Year</th>
                  <th scope="col">Edit</th>
                  <th scope="col">Remove</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses?.map((expense) => (
                  <tr
                    className="text-center even:bg-[#1a1a1a] hover:bg-[#313131] [&>*]:px-6 [&>*]:py-4 [&>td]:whitespace-nowrap"
                    key={expense.id}
                  >
                    <th scope="row" className="font-medium">
                      {expense.name}
                    </th>
                    <td className="text-green-600">${expense.value}</td>
                    <td>
                      {LONG_MONTHS_FORMATTER.format(new Date(expense.date))}
                    </td>
                    <td>{new Date(expense.date).getFullYear()}</td>
                    <td>
                      <Link
                        className="flex justify-center transition-transform duration-300 hover:-translate-y-[2px]"
                        title={`Edit expense: ${expense.name}`}
                        href={`/expenses/edit/${expense.id}`}
                      >
                        <Image
                          src={"/icons/edit.svg"}
                          alt="edit-icon"
                          width={24}
                          height={24}
                        />
                      </Link>
                    </td>
                    <td>
                      <Button
                        title={`Remove expense: ${expense.name}`}
                        className="mx-auto flex justify-center transition-transform duration-300 hover:-translate-y-[2px]"
                        onClick={() => {
                          handleRemoval(expense);
                        }}
                      >
                        <Image
                          src={"/icons/recycle-bin.svg"}
                          alt="bin-icon"
                          width={20}
                          height={20}
                        />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <svg
              className={`min-w-full select-none`}
              width={`${expenses.length * 60 + 10}`}
              height={CHART_HEIGHT}
            >
              {filteredExpenses.map((expense, index) => (
                <Fragment key={`chart-${expense.id}`}>
                  <rect
                    rx={3}
                    x={index * 60 + 20}
                    y={
                      CHART_HEIGHT -
                      20 -
                      (expense.value / maxAmount) * (CHART_HEIGHT - 60)
                    }
                    height={(expense.value / maxAmount) * (CHART_HEIGHT - 60)}
                    className={`w-10 ${
                      expense.value === maxAmount
                        ? "fill-red-700"
                        : "fill-blue-700"
                    }`}
                  >
                    <title>{`$${expense.value}`}</title>
                  </rect>
                  <foreignObject
                    x={index * 60 + BAR_WIDTH - 40}
                    y={
                      CHART_HEIGHT -
                      20 -
                      (expense.value / maxAmount) * (CHART_HEIGHT - 60) -
                      35
                    }
                    className={`h-8 w-20 text-[12px]`}
                  >
                    <p className="flex h-full items-end justify-center text-center">
                      {expense.name}
                    </p>
                  </foreignObject>
                  <text
                    x={index * 60 + BAR_WIDTH}
                    y={CHART_HEIGHT - 6}
                    className={`fill-[#f5f5f5] text-[12px] font-semibold tracking-wider`}
                    textAnchor="middle"
                  >
                    {`$${expense.value}`}
                  </text>
                </Fragment>
              ))}
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

ExpensesChart.displayName = "Expenses";

export default withAuth(ExpensesChart);
