export enum ELeaveRequestStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum ELeaveRequestType {
  CASUAL = "casual",
  SICK = "sick",
  EARNED = "earned",
  WITHOUT_PAY = "without_pay",
}

export type LeaveRequestType = {
  _id: string;
  employee_id: string;
  leave_type: ELeaveRequestType;
  start_date: Date;
  end_date: Date;
  day_count: number;
  reason: string;
  status: ELeaveRequestStatus;
  response_date: Date;
};

export type LeaveRequestFilterOptions = {
  search?: string;
  employee_id?: string;
};
