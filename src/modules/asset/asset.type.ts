export enum ECurrency {
  BDT = "bdt",
  USD = "usd",
}

export enum EAssetLogType {
  HANDOVER = "handover",
  REPAIR = "repair",
  TAKEOVER = "takeover",
  OTHER = "other",
}

export enum EAssetType {
  MACBOOK = "macbook",
  MACMINI = "macmini",
  IMAC = "imac",
  LAPTOP = "laptop",
  DESKTOP = "desktop",
  MOBILE = "mobile",
  KEYBOARD = "keyboard",
  MOUSE = "mouse",
  MONITOR = "monitor",
  HEADSET = "headset",
  PRINTER = "printer",
  ROUTER = "router",
  OTHER = "other",
}

export enum EAssetStatus {
  ENGAGED = "engaged",
  ARCHIVED = "archived",
  LOST = "lost",
  DAMAGED = "damaged",
  SOLD = "sold",
}

export type TAssetLog = {
  type: EAssetLogType;
  description: string;
  date: Date;
};

export type AssetType = {
  asset_id: string;
  user: string;
  name: string;
  type: EAssetType;
  serial_number: string;
  price: number;
  currency: ECurrency;
  purchase_date: Date;
  status: EAssetStatus;
  note: string;
  logs: TAssetLog[];
};

export type AssetFilterOptions = {
  search?: string;
  user?: string;
};
