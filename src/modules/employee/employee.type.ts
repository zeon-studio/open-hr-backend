import { EJobType } from "../employee-job/employee-job.type";

export enum EDepartment {
  DEVELOPMENT = "development",
  DESIGN = "design",
  MARKETING = "marketing",
  ADMIN = "admin",
  PRODUCTION = "production",
  HR_FINANCE = "hr_finance",
  OTHER = "other",
}

export enum EGender {
  MALE = "male",
  FEMALE = "female",
}

export enum EMaritalStatus {
  MARRIED = "married",
  UNMARRIED = "unmarried",
  DIVORCED = "divorced",
  WIDOWED = "widowed",
}

export enum EBloodGroup {
  O_POSITIVE = "o+",
  O_NEGATIVE = "o-",
  A_POSITIVE = "a+",
  A_NEGATIVE = "a-",
  B_POSITIVE = "b+",
  B_NEGATIVE = "b-",
  AB_POSITIVE = "ab+",
  AB_NEGATIVE = "ab-",
}

export enum ERole {
  USER = "user",
  MODERATOR = "moderator",
  ADMIN = "admin",
  ALUMNI = "alumni",
}

export enum EEmployeeStatus {
  PENDING = "pending",
  ACTIVE = "active",
  ARCHIVED = "archived",
}

export type EmployeeType = {
  id: string;
  name: string;
  image: string;
  work_email: string;
  department: EDepartment;
  designation: string;
  personal_email: string;
  communication_id: string;
  password: string;
  dob: Date;
  nid: string;
  tin: string;
  phone: string;
  gender: EGender;
  blood_group: EBloodGroup;
  marital_status: EMaritalStatus;
  present_address: string;
  permanent_address: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  personality: string;
  note: string;
  status: EEmployeeStatus;
  role: ERole;
};

export type EmployeeCreateType = {
  personal_email: string;
  department: EDepartment;
  job_type: EJobType;
  gross_salary: number;
  joining_date: Date;
  designation: string;
  manager_id: string;
};

export type EmployeeFilterOptions = {
  search?: string | number;
  status?: EEmployeeStatus;
  department?: EDepartment;
};
