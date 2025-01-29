export type OnboardingTask = {
  task_name: string;
  assigned_to: string;
  status: string;
};

export type EmployeeOnboardingType = {
  employee_id: string;
  tasks: OnboardingTask[];
};

export type EmployeeOnboardingFilterOptions = {
  search?: string;
};
