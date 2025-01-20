export type PrevJob = {
  company_name: string;
  company_website: string;
  designation: string;
  start_date: Date;
  end_date: Date;
  job_type: "full_time" | "part_time" | "remote" | "contractual" | "internship";
};

export type Promotion = {
  designation: string;
  promotion_date: Date;
};

export type EmployeeJobType = {
  employee_id: string;
  job_type: "full_time" | "part_time" | "remote" | "contractual" | "internship";
  joining_date: Date;
  designation: string;
  manager_id: string;
  department: "development" | "design" | "marketing" | "admin";
  permanent_date: Date;
  company_name: string;
  company_website: string;
  resignation_date: Date;
  prev_jobs: PrevJob[];
  promotions: Promotion[];
  note: string;
};

export type EmployeeJobFilterOptions = {
  search?: string;
  designation?: string;
};
