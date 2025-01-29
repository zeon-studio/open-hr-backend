export type Education = {
  degree: string;
  institute: string;
  passing_year: number;
  result: number;
  result_type: "gpa" | "cgpa" | "percentage";
  major: string;
};

export type EmployeeEducationType = {
  employee_id: string;
  educations: Education[];
};

export type EmployeeEducationFilterOptions = {
  search?: string;
};
