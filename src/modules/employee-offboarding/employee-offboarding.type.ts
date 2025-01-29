export type OffboardingTask = {
  task_name: string;
  assigned_to: string;
  status: string;
};

export type EmployeeOffboardingType = {
  employee_id: string;
  tasks: OffboardingTask[];
};

export type EmployeeOffboardingCreate = {
  employee_id: string;
  resignation_date: Date;
  tasks: OffboardingTask[];
};

export type EmployeeOffboardingFilterOptions = {
  search?: string;
};
