import Expenses from "@/components/Expenses.client";
export default async function Page() {
  return (
    <section className="min-h-[calc(100vh-218px)]">
      <Expenses />
    </section>
  );
}
