export type MenuItem = {
  name: string;
  url: string;
  access: ("admin" | "user" | "moderator")[];
};

export type LeaveItem = {
  name: "earned" | "sick" | "casual" | "without_pay";
  days: number;
};

export type TaskItem = {
  name: string;
  assigned_to: string;
};

export type ConditionalWeekend = {
  name: string;
  pattern: number[];
};

export type SettingType = {
  app_name: string;
  app_url: string;
  favicon_url: string;
  logo_url: string;
  logo_width: number;
  logo_height: number;
  company_name: string;
  company_website: string;
  menus: MenuItem[];
  weekends: string[];
  conditional_weekends: ConditionalWeekend[];
  leaves: LeaveItem[];
  onboarding_tasks: TaskItem[];
  offboarding_tasks: TaskItem[];
};
