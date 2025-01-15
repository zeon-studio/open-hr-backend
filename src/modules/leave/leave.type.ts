export type LeaveYear = {
  year: number;
  casual: {
    allotted: number;
    consumed: number;
  };
  earned: {
    allotted: number;
    consumed: number;
  };
  sick: {
    allotted: number;
    consumed: number;
  };
  without_pay: {
    allotted: number;
    consumed: number;
  };
};

export type LeaveType = {
  employee_id: string;
  years: LeaveYear[];
};

export type LeaveFilterOptions = {
  search?: string;
  employee_id?: string;
};
