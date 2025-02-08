export enum EPayrollStatus {
  ACTIVE = "active",
  ARCHIVED = "archived",
}

export enum EBonusType {
  FESTIVE = "festive",
  PERFORMANCE = "performance",
  PROJECT = "project",
  OTHER = "other",
}

export type Salary = {
  amount: number;
  date: Date;
};

export type Bonus = {
  type: EBonusType;
  reason: string;
  amount: number;
  date: Date;
};

export type Increment = {
  reason: string;
  amount: number;
  date: Date;
};

export type CreateMonthlySalary = {
  salary_date: Date;
  employees: {
    employee_id: string;
    gross_salary: number;
    bonus_type: string;
    bonus_reason: string;
    bonus_amount: number;
  }[];
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
