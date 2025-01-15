export type Organization = {
  name: string;
  login_id: string;
  password: string;
  price: number;
  currency: string;
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
