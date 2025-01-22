export type Log = {
  type: "handover" | "return" | "repair" | "lost" | "damaged";
  description: string;
  date: Date;
};

export type AssetType = {
  asset_id: string;
  user: string;
  name: string;
  type:
    | "macbook"
    | "macmini"
    | "imac"
    | "laptop"
    | "desktop"
    | "mobile"
    | "keyboard"
    | "mouse"
    | "monitor"
    | "headset"
    | "printer"
    | "router"
    | "other";
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
