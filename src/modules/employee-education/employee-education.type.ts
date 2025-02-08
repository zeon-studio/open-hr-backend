export enum EResultType {
  GPA = "gpa",
  CGPA = "cgpa",
  PERCENTAGE = "percentage",
}

export type Education = {
  degree: string;
  institute: string;
  passing_year: number;
  result: number;
  result_type: EResultType;
  major: string;
};

export type EmployeeEducationType = {
  employee_id: string;
  educations: Education[];
};

export type EmployeeEducationFilterOptions = {
  search?: string;
};
