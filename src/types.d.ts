export type Expense = {
  id?: string;
  name: string;
  value: number;
  month:
    | "January"
    | "February"
    | "March"
    | "April"
    | "May"
    | "June"
    | "July"
    | "August"
    | "September"
    | "October"
    | "November"
    | "December"
    | string;
  year: string;
  userId?: string;
};
