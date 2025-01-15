export type LeaveRequestType = {
  employee_id: string;
  leave_type: string;
  start_date: Date;
  end_date: Date;
  day_count: number;
  reason: string;
  status: string;
  submit_date: Date;
  response_date: Date;
};

export type LeaveRequestFilterOptions = {
  search?: string;
  employee_id?: string;
};
