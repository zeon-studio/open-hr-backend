export type Contact = {
  name: string;
  relation: string;
  phone: string;
};

export type EmployeeContactType = {
  employee_id: string;
  contacts: Contact[];
};

export type EmployeeContactFilterOptions = {
  search?: string;
};
