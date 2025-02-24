import config from "@/config/variables";

const departmentGenerator: { [key: string]: string } = {
  development: "DEV",
  marketing: "MKT",
  design: "DGN",
  admin: "ADM",
  production: "PDC",
  hr_finance: "HRF",
  other: "OTH",
};

const assetTypeGenerator: { [key: string]: string } = {
  macbook: "MBK",
  macmini: "MNI",
  imac: "IMC",
  laptop: "LPT",
  desktop: "DPT",
  mobile: "MBL",
  keyboard: "KBD",
  mouse: "MUS",
  monitor: "MON",
  headset: "HST",
  printer: "PRN",
  router: "RTR",
  other: "OTH",
};

const findYear = (date: Date) => {
  const year = date.getFullYear();
  return year;
};

const make3digit = (num: number) => {
  return num.toString().padStart(3, "0");
};

// employee id generator
export const generateEmployeeId = (
  department: string,
  joining_date: Date,
  departmentSerial: number
) => {
  const userId =
    config.id_prefix +
    departmentGenerator[department] +
    findYear(joining_date) +
    make3digit(departmentSerial);

  return userId;
};

// asset id generator
export const generateAssetId = (assetType: string, assetSerial: number) => {
  const assetId =
    config.id_prefix +
    "_" +
    assetTypeGenerator[assetType] +
    "_" +
    assetSerial.toString();
  return assetId;
};
