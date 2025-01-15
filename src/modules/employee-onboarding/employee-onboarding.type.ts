export type OnboardingTask = {
  task_name: string;
  assigned_to: string;
  status: string;
};

export type EmployeeOnboardingType = {
  employee_id: string;
  fingerprint: OnboardingTask;
  id_card: OnboardingTask;
  appointment_letter: OnboardingTask;
  employment_contract: OnboardingTask;
  welcome_kit: OnboardingTask;
  office_intro: OnboardingTask;
};

export type EmployeeOnboardingFilterOptions = {
  search?: string;
};
