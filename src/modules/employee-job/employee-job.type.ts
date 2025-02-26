export enum EJobType {
  FULL_TIME = "full_time",
  PART_TIME = "part_time",
  REMOTE = "remote",
  CONTRACTUAL = "contractual",
  INTERNSHIP = "internship",
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
  manager_id: string;
  permanent_date: Date;
  resignation_date: Date;
  promotions: Promotion[];
  prev_jobs: PrevJob[];
  note: string;
};

export type EmployeeJobFilterOptions = {
  search?: string;
};
