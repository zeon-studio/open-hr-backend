export enum ECurrency {
  BDT = "bdt",
  USD = "usd",
}

export enum EBilling {
  MONTHLY = "monthly",
  YEARLY = "yearly",
  ONETIME = "onetime",
}
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
