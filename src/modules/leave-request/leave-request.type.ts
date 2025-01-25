export type LeaveRequestType = {
  _id: string;
  employee_id: string;
  leave_type: "casual" | "sick" | "earned" | "without_pay";
  start_date: Date;
  end_date: Date;
  day_count: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  response_date: Date;
};

export type LeaveRequestFilterOptions = {
  search?: string;
  employee_id?: string;
};
