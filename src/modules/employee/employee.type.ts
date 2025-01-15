export type EmployeeType = {
  id: string;
  name: string;
  image: string;
  work_email: string;
  personal_email: string;
  department: string;
  manager: string;
  role: string;
  dob: Date;
  nid: string;
  tin: string;
  phone: string;
  gender: string;
  blood_group: string;
  marital_status: string;
  present_address: string;
  permanent_address: string;
  status: "pending" | "active" | "archived";
  note: string;
};

export type EmployeeCreateType = {
  personal_email: string;
  department: string;
  job_type: "full_time" | "part_time" | "remote" | "contractual";
  joining_date: Date;
  designation: string;
};

export type EmployeeFilterOptions = {
  search?: string | number;
  department?: string;
};
