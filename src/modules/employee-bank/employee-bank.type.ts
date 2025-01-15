export type Bank = {
  bank_name: string;
  bank_ac_name: string;
  bank_ac_no: string;
  bank_district: string;
  bank_branch: string;
  bank_routing_no: string;
};

export type EmployeeBankType = {
  employee_id: string;
  banks: Bank[];
};

export type EmployeeBankFilterOptions = {
  search?: string;
};
