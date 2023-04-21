"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import Button from "./Button.client";
import Select from "./Select.client";
import withAuth from "@/hoc/withAuth";
import ExpenseForm from "./ExpenseForm.client";
import { addExpense, auth, getExpenses, removeExpense } from "@/lib/firebase";
import { type Expense } from "@/types";
import Link from "next/link";
import { MONTHS, YEARS } from "@/globals";

const ExpensesChart: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString("default", { month: "long" })
  );
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [showForm, setShowForm] = useState(false);

  const [showList, setShowList] = useState(false);

  const handleAddExpense = useCallback(async (expense: Expense) => {
    await addExpense(auth.currentUser?.uid!, expense);

    const updatedExpenses = await getExpenses(auth.currentUser?.uid!);
    setExpenses(updatedExpenses);
    setShowForm(false);
  }, []);

  const handleRemoval = async (expense: Expense) => {
    await removeExpense(auth.currentUser?.uid!, expense);

    const updatedExpenses = await getExpenses(auth.currentUser?.uid!);
    setExpenses(updatedExpenses);
  };

  const fetchExpenses = useCallback(async () => {
    const expensesitem = await getExpenses(auth.currentUser?.uid!);
    setExpenses(expensesitem);
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

  const CHART_HEIGHT = 510;
  const BAR_WIDTH = 40;

  return (
    <>
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <Button
          type="submit"
          onClick={() => setShowForm((prev) => !prev)}
          className="btn-transparent"
        >
          Add Expense
        </Button>
        <Button
          type="submit"
          onClick={() => setShowList((prev) => !prev)}
          className="btn-transparent w-[135px] sm:w-fit"
        >
          {showList ? "Show Chart" : "Edit Expenses"}
        </Button>
      </div>

      {showForm ? <ExpenseForm submitHandler={handleAddExpense} /> : null}

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
        {filteredExpenses.length < 1 ? (
          <div className="pt-2 text-center">No expenses this month</div>
        ) : null}
        {showList ? (
          <ul className="flex flex-col gap-6 p-4">
            {filteredExpenses.map((item, index) => (
              <li
                className="flex items-center justify-between rounded-full p-5 shadow-sm shadow-gray-900 sm:p-6"
                key={`list-${item.id || index}`}
              >
                <div className="font-semibold">
                  <span> {item.name}</span> -{" "}
                  <span className="text-green-600">{`$${item.value}`}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/expenses/edit/${item.id}`}
                    className="px-2 py-1"
                  >
                    <svg
                      viewBox="-4 0 32 32"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 fill-gray-300"
                    >
                      <path d="M17.438 22.469v-4.031l2.5-2.5v7.344c0 1.469-1.219 2.688-2.656 2.688h-14.625c-1.469 0-2.656-1.219-2.656-2.688v-14.594c0-1.469 1.188-2.688 2.656-2.688h14.844v0.031l-2.5 2.469h-11.5c-0.531 0-1 0.469-1 1.031v12.938c0 0.563 0.469 1 1 1h12.938c0.531 0 1-0.438 1-1zM19.813 7.219l2.656 2.656 1.219-1.219-2.656-2.656zM10.469 16.594l2.625 2.656 8.469-8.469-2.625-2.656zM8.594 21.094l3.625-0.969-2.656-2.656z"></path>
                    </svg>
                  </Link>
                  <Button
                    onClick={() => {
                      handleRemoval(item);
                    }}
                    className="px-2 py-1"
                  >
                    <svg
                      version="1.1"
                      className="h-6 w-6 fill-red-700"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 589.004 589.004"
                      xmlSpace="preserve"
                    >
                      <g>
                        <g>
                          <path
                            d="M451.716,146.986H137.289c-16.287,0-31.952,6.876-42.977,18.865c-11.025,11.988-16.566,28.173-15.205,44.403
			l27.241,324.744c1.227,14.629,7.854,28.158,18.66,38.096c10.805,9.938,24.842,15.41,39.521,15.41h259.947
			c14.68,0,28.715-5.473,39.521-15.41s17.434-23.467,18.66-38.097l27.24-324.744c1.361-16.229-4.18-32.414-15.205-44.402
			C483.669,153.862,468.003,146.986,451.716,146.986z M467.208,206.672l-27.24,324.745c-0.676,8.055-7.41,14.247-15.492,14.247
			H164.53c-8.083,0-14.817-6.192-15.492-14.247l-27.241-324.745c-0.761-9.067,6.393-16.846,15.492-16.846h314.427
			C460.815,189.826,467.968,197.605,467.208,206.672z"
                          />
                          <path
                            d="M424.476,589.004H164.529c-14.807,0-28.962-5.52-39.86-15.542c-10.899-10.022-17.583-23.668-18.82-38.422L78.608,210.296
			c-1.373-16.37,4.216-32.693,15.335-44.784c11.119-12.092,26.918-19.027,43.345-19.027h314.427
			c16.429,0,32.227,6.935,43.345,19.027c11.119,12.09,16.708,28.413,15.335,44.782l-27.24,324.744
			c-1.237,14.755-7.921,28.4-18.819,38.423C453.437,583.484,439.28,589.004,424.476,589.004z M137.289,147.486
			c-16.148,0-31.679,6.817-42.609,18.704c-10.93,11.885-16.425,27.931-15.075,44.023l27.241,324.744
			c1.216,14.504,7.787,27.917,18.5,37.77c10.712,9.853,24.628,15.278,39.183,15.278h259.947c14.554,0,28.469-5.426,39.183-15.278
			c10.715-9.853,17.285-23.266,18.501-37.771l27.24-324.744c1.35-16.091-4.145-32.137-15.075-44.021
			c-10.929-11.886-26.459-18.704-42.608-18.704H137.289z M424.476,546.164H164.53c-8.275,0-15.299-6.459-15.99-14.705
			l-27.241-324.745c-0.374-4.461,1.149-8.909,4.179-12.203c3.03-3.295,7.335-5.185,11.811-5.185h314.427
			c4.477,0,8.781,1.889,11.811,5.184c3.03,3.294,4.554,7.743,4.18,12.204l-27.24,324.745
			C439.774,539.705,432.75,546.164,424.476,546.164z M137.289,190.326c-4.197,0-8.234,1.772-11.075,4.861
			c-2.841,3.089-4.269,7.26-3.918,11.442l27.241,324.745c0.648,7.732,7.234,13.789,14.994,13.789h259.946
			c7.759,0,14.346-6.057,14.994-13.789l27.24-324.745c0.351-4.183-1.078-8.354-3.92-11.443c-2.841-3.089-6.877-4.86-11.074-4.86
			H137.289z"
                          />
                        </g>
                        <g>
                          <path
                            d="M89.292,123.835h410.42c11.83,0,21.42-9.59,21.42-21.42c0-11.83-9.59-21.42-21.42-21.42h-77.799v-0.966V58.886
			c0-32.194-26.191-58.386-58.385-58.386H225.478c-32.194,0-58.386,26.192-58.386,58.386v21.143v0.966H89.292
			c-11.83,0-21.42,9.59-21.42,21.42C67.872,114.245,77.462,123.835,89.292,123.835z M209.931,58.886
			c0-8.586,6.96-15.546,15.546-15.546h138.051c8.584,0,15.545,6.96,15.545,15.546v21.143H209.931V58.886z"
                          />
                          <path
                            d="M499.712,124.335H89.292c-12.087,0-21.92-9.833-21.92-21.92c0-12.086,9.833-21.92,21.92-21.92h77.299V58.886
			C166.591,26.417,193.007,0,225.478,0h138.051c32.469,0,58.885,26.417,58.885,58.886v21.609h77.299
			c12.087,0,21.92,9.833,21.92,21.92C521.632,114.502,511.799,124.335,499.712,124.335z M89.292,81.495
			c-11.535,0-20.92,9.385-20.92,20.92c0,11.536,9.385,20.92,20.92,20.92h410.42c11.535,0,20.92-9.385,20.92-20.92
			c0-11.535-9.385-20.92-20.92-20.92h-78.299V58.886C421.413,26.968,395.446,1,363.528,1H225.478
			c-31.918,0-57.886,25.968-57.886,57.886v22.609H89.292z M379.573,80.528H209.431V58.886c0-8.848,7.198-16.046,16.046-16.046
			h138.051c8.848,0,16.045,7.198,16.045,16.046V80.528z M210.431,79.528h168.142V58.886c0-8.296-6.749-15.046-15.045-15.046H225.478
			c-8.297,0-15.046,6.75-15.046,15.046V79.528z"
                          />
                        </g>
                        <g>
                          <path
                            d="M218.867,272.233c-0.78-11.805-10.99-20.739-22.785-19.961c-11.805,0.78-20.742,10.982-19.961,22.786l12.438,188.198
			c0.748,11.323,10.166,20.008,21.352,20.008c0.475,0,0.953-0.016,1.434-0.047c11.804-0.78,20.741-10.981,19.961-22.786
			L218.867,272.233z"
                          />
                          <path
                            d="M209.91,483.765c-11.494,0-21.092-8.993-21.851-20.475l-12.438-188.198c-0.386-5.843,1.526-11.485,5.384-15.89
			s9.201-7.042,15.043-7.429c12.139-0.79,22.526,8.462,23.317,20.427l12.438,188.198c0.797,12.061-8.366,22.521-20.427,23.318
			C210.885,483.749,210.396,483.765,209.91,483.765z M197.511,252.725c-0.463,0-0.928,0.016-1.396,0.046
			c-5.576,0.369-10.674,2.886-14.357,7.089c-3.682,4.204-5.507,9.589-5.138,15.165l12.438,188.198
			c0.754,11.422,10.691,20.246,22.254,19.495c11.51-0.761,20.255-10.744,19.495-22.254l-12.438-188.198
			C217.645,261.309,208.483,252.725,197.511,252.725z"
                          />
                        </g>
                        <g>
                          <path
                            d="M294.502,252.226c-11.83,0-21.42,9.59-21.42,21.42v188.198c0,11.83,9.59,21.42,21.42,21.42
			c11.831,0,21.42-9.59,21.42-21.42V273.646C315.923,261.816,306.333,252.226,294.502,252.226z"
                          />
                          <path
                            d="M294.502,483.764c-12.087,0-21.92-9.833-21.92-21.92V273.646c0-12.087,9.833-21.92,21.92-21.92
			c12.087,0,21.92,9.833,21.92,21.92v188.198C316.423,473.931,306.59,483.764,294.502,483.764z M294.502,252.726
			c-11.535,0-20.92,9.385-20.92,20.92v188.198c0,11.535,9.385,20.92,20.92,20.92c11.536,0,20.92-9.385,20.92-20.92V273.646
			C315.423,262.11,306.038,252.726,294.502,252.726z"
                          />
                        </g>
                        <g>
                          <path
                            d="M392.923,252.272c-11.797-0.778-22.006,8.156-22.785,19.961L357.7,460.432c-0.779,11.805,8.156,22.006,19.961,22.786
			c0.482,0.031,0.959,0.047,1.434,0.047c11.186,0,20.604-8.686,21.354-20.008l12.436-188.198
			C413.665,263.254,404.728,253.052,392.923,252.272z"
                          />
                          <path
                            d="M379.095,483.765c-0.485,0-0.973-0.016-1.466-0.048c-12.061-0.797-21.224-11.258-20.428-23.318l12.438-188.198
			c0.79-11.965,11.187-21.222,23.317-20.427c5.843,0.386,11.185,3.024,15.043,7.428s5.771,10.047,5.384,15.89L400.947,463.29
			C400.187,474.771,390.588,483.765,379.095,483.765z M391.493,252.725c-10.972,0-20.133,8.583-20.856,19.541l-12.438,188.199
			c-0.76,11.51,7.985,21.493,19.495,22.254c11.605,0.75,21.499-8.074,22.255-19.495l12.436-188.198
			c0.369-5.576-1.455-10.961-5.138-15.165c-3.683-4.204-8.781-6.721-14.357-7.089C392.422,252.741,391.956,252.725,391.493,252.725z
			"
                          />
                        </g>
                      </g>
                    </svg>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          // CHART
          <div className="overflow-x-auto">
            <svg
              className={`min-w-full select-none`}
              width={`${expenses.length * 60 + 10}`}
              height={CHART_HEIGHT}
            >
              {filteredExpenses.map((item, index) => (
                <Fragment key={`chart-${item.id}`}>
                  <rect
                    x={index * 60 + 20}
                    y={
                      CHART_HEIGHT -
                      20 -
                      (item.value / maxAmount) * (CHART_HEIGHT - 50)
                    }
                    height={(item.value / maxAmount) * (CHART_HEIGHT - 50)}
                    className={`w-10 ${
                      item.value === maxAmount
                        ? "fill-red-700"
                        : "fill-blue-700"
                    }`}
                    rx="5"
                  >
                    <title>{`$${item.value}`}</title>
                  </rect>
                  <foreignObject
                    x={index * 60 + BAR_WIDTH - 40}
                    y={
                      CHART_HEIGHT -
                      20 -
                      (item.value / maxAmount) * (CHART_HEIGHT - 50) -
                      25
                    }
                    className={`h-20 w-20 fill-[#bbb] text-center text-[12px]`}
                    textAnchor="middle"
                  >
                    <span>{item.name}</span>
                  </foreignObject>
                  <text
                    x={index * 60 + BAR_WIDTH}
                    y={CHART_HEIGHT - 6}
                    className={`fill-[#f5f5f5] text-[12px] font-semibold tracking-wider`}
                    textAnchor="middle"
                  >
                    {`$${item.value}`}
                  </text>
                </Fragment>
              ))}
            </svg>
          </div>
        )}
      </div>
    </>
  );
};
ExpensesChart.displayName = "Expenses";

export default withAuth(ExpensesChart);
