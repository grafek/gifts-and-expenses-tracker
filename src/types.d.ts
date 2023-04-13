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
  year: number;
  userId?: string;
};

export type User = {
  displayName: string | null;
  email: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  providerId: string;
};
