export enum EJobType {
  FULL_TIME = "full_time",
  PART_TIME = "part_time",
  REMOTE = "remote",
  CONTRACTUAL = "contractual",
  INTERNSHIP = "internship",
}

export enum EDepartment {
  DEVELOPMENT = "development",
  DESIGN = "design",
  MARKETING = "marketing",
  ADMIN = "admin",
}

export type PrevJob = {
  company_name: string;
  company_website: string;
  designation: string;
  start_date: Date;
  end_date: Date;
  job_type: EJobType;
};

export type Promotion = {
  designation: string;
  promotion_date: Date;
};

export type EmployeeJobType = {
  employee_id: string;
  job_type: EJobType;
  joining_date: Date;
  designation: string;
  manager_id: string;
  department: EDepartment;
  permanent_date: Date;
  company_name: string;
  company_website: string;
  resignation_date: Date;
  promotions: Promotion[];
  prev_jobs: PrevJob[];
  note: string;
};

export type EmployeeJobFilterOptions = {
  search?: string;
  designation?: string;
};
