export type Achievement = {
  name: string;
  type: string;
  date: Date;
};

export type EmployeeAchievementType = {
  employee_id: string;
  achievements: Achievement[];
};

export type EmployeeAchievementFilterOptions = {
  search?: string;
};
