export type OnboardingTask = {
  task_name: string;
  assigned_to: string;
  status: string;
};

export type EmployeeOnboardingType = {
  employee_id: string;
  add_fingerprint: OnboardingTask;
  provide_id_card: OnboardingTask;
  provide_appointment_letter: OnboardingTask;
  provide_employment_contract: OnboardingTask;
  provide_welcome_kit: OnboardingTask;
  provide_devices: OnboardingTask;
  provide_office_intro: OnboardingTask;
};

export type EmployeeOnboardingFilterOptions = {
  search?: string;
};
