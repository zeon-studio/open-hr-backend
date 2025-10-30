export enum ECurrency {
  BDT = "bdt",
  USD = "usd",
}

export enum EBilling {
  MONTHLY = "monthly",
  YEARLY = "yearly",
  ONETIME = "onetime",
}

export enum EOrganizationStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
  ARCHIVED = "archived",
}

export enum EOrganizationLogType {
  RENEWED = "renewed",
  CANCELLED = "cancelled",
  PAUSED = "paused",
  RESUMED = "RESUMED",
}

export type TOrganizationLog = {
  type: EOrganizationLogType;
  description: string;
  date: Date;
};

export type Organization = {
  _id: string;
  name: string;
  login_id: string;
  password: string;
  price: number;
  currency: ECurrency;
  billing: EBilling;
  users: string[];
  purchase_date: Date;
  expire_date: Date;
  status: EOrganizationStatus;
  logs: TOrganizationLog[];
};

export type ToolType = {
  platform: string;
  website: string;
  organizations: Organization[];
};

export type ToolFilterOptions = {
  search?: string;
  platform?: string;
};
