export type Expense = {
  id?: string;
  name: string;
  value: number;
  date: Date | string;
  userId?: string;
};

export type Gift = {
  id?: string;
  name: string;
  receiver: string;
  giver: string;
  date: Date | string;
};
