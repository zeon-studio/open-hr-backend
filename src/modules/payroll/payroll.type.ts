export enum EPayrollStatus {
  ACTIVE = "active",
  ARCHIVED = "archived",
}

export type Salary = {
  amount: number;
  date: Date;
};

export type Bonus = {
  reason: string;
  amount: number;
  date: Date;
};

export type Increment = {
  reason: string;
  amount: number;
  date: Date;
};

export type PayrollType = {
  employee_id: string;
  gross_salary: number;
  salary: Salary[];
  bonus: Bonus[];
  increments: Increment[];
  status: EPayrollStatus;
};

export type PayrollFilterOptions = {
  search?: string;
};
