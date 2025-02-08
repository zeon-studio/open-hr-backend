import { ELeaveRequestType } from "../leave-request/leave-request.type";

export enum EModule {
  TOOL = "tool",
  ASSET = "asset",
  LEAVE = "leave",
  COURSE = "course",
  PAYROLL = "payroll",
  CALENDAR = "calendar",
  EMPLOYEE_BANK = "employee_bank",
  EMPLOYEE_CONTACT = "employee_contact",
  EMPLOYEE_DOCUMENT = "employee_document",
  EMPLOYEE_LIFECYCLE = "employee_lifecycle",
  EMPLOYEE_EDUCATION = "employee_education",
  EMPLOYEE_ACHIEVEMENT = "employee_achievement",
}

export type ModuleItem = {
  name: EModule;
  description: string;
  enable: boolean;
};

export type LeaveItem = {
  name: ELeaveRequestType;
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
  modules: ModuleItem[];
  weekends: string[];
  conditional_weekends: ConditionalWeekend[];
  leaves: LeaveItem[];
  onboarding_tasks: TaskItem[];
  offboarding_tasks: TaskItem[];
};
