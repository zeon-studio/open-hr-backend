export type Organization = {
  _id: string;
  name: string;
  login_id: string;
  password: string;
  price: number;
  currency: string;
  billing: "monthly" | "yearly" | "onetime";
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
