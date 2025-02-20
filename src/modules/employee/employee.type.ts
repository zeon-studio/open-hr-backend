import { EDepartment, EJobType } from "../employee-job/employee-job.type";

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
  O_POSITIVE = "O+",
  O_NEGATIVE = "O-",
  A_POSITIVE = "A+",
  A_NEGATIVE = "A-",
  B_POSITIVE = "B+",
  B_NEGATIVE = "B-",
  AB_POSITIVE = "AB+",
  AB_NEGATIVE = "AB-",
}

export enum ERole {
  USER = "user",
  MODERATOR = "moderator",
  ADMIN = "admin",
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
};
