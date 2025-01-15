export type Education = {
  degree: string;
  institute: string;
  passing_year: number;
  result: string;
  major: string;
};

export type EmployeeEducationType = {
  employee_id: string;
  educations: Education[];
};

export type EmployeeEducationFilterOptions = {
  search?: string;
};
