export type Log = {
  log: string;
  date: Date;
};

export type AssetType = {
  name: string;
  type: string;
  asset_id: string;
  serial_number: string;
  price: number;
  currency: string;
  user: string;
  purchase_date: Date;
  archive: boolean;
  note: string;
  logs: Log[];
};

export type AssetFilterOptions = {
  search?: string;
  user?: string;
};
