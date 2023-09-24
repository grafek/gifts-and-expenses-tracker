"use client";
import ExpenseForm from "@/components/ExpenseForm.client";
import { FormSkeleton } from "@/components/Loaders.server";
import { useAuthContext } from "@/context/AuthContext";
import { auth, getExpenseById, updateExpense } from "@/lib/firebase";
import { type Expense } from "@/types";
import { type Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function Page({ params }: { params: Params }) {
  const [expense, setExpense] = useState<Expense | null>(null);

  const router = useRouter();

  const { loading, user } = useAuthContext();

  useEffect(() => {
    (async () => {
      if (!loading) {
        const data = await getExpenseById(auth.currentUser?.uid!, params.id);
        setExpense(data);
      }
    })();
  }, [loading, params.id, user?.uid]);

  const handleUpdateExpense = useCallback(
    async (expense: Expense) => {
      await updateExpense(user?.uid as string, expense);

      router.push("/expenses");
    },
    [router, user?.uid],
  );

  if (loading || !expense) {
    return (
      <section className="center">
        <FormSkeleton />
      </section>
    );
  }

  return (
    <>
      <h1 className="text-lg font-semibold">
        Editing <span className="italic">{expense.name}</span> expense
      </h1>
      <ExpenseForm
        defaultValues={expense}
        submitHandler={handleUpdateExpense}
      />
    </>
  );
}
