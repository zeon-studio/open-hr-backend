export type Log = {
  log: string;
  date: Date;
};

export type AssetType = {
  asset_id: string;
  user_id: string;
  name: string;
  type: "laptop" | "desktop" | "mobile" | "keyboard" | "mouse" | "monitor";
  serial_number: string;
  price: number;
  currency: "bdt" | "usd";
  purchase_date: Date;
  archive: boolean;
  note: string;
  logs: Log[];
};

export type AssetFilterOptions = {
  search?: string;
  user?: string;
};
