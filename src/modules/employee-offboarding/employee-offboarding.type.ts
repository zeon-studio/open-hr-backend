export type OffboardingTask = {
  task_name: string;
  assigned_to: string;
  status: string;
};

export type EmployeeOffboardingType = {
  employee_id: string;
  remove_fingerprint: OffboardingTask;
  task_handover: OffboardingTask;
  collect_id_card: OffboardingTask;
  collect_email: OffboardingTask;
  collect_devices: OffboardingTask;
  nda_agreement: OffboardingTask;
  provide_certificate: OffboardingTask;
  farewell: OffboardingTask;
};

export type EmployeeOffboardingCreate = {
  employee_id: string;
  resignation_date: Date;
};

export type EmployeeOffboardingFilterOptions = {
  search?: string;
};
