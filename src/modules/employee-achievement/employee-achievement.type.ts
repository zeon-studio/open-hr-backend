export enum EAchievementType {
  AWARD = "award",
  RECOGNITION = "recognition",
  CERTIFICATE = "certificate",
  COURSE = "course",
  TRAINING = "training",
  OTHER = "other",
}

export type Achievement = {
  type: EAchievementType;
  description: string;
  date: Date;
};

export type EmployeeAchievementType = {
  employee_id: string;
  achievements: Achievement[];
};

export type EmployeeAchievementFilterOptions = {
  search?: string;
};
