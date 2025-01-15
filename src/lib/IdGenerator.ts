const departmentGenerator: { [key: string]: string } = {
  development: "DEV",
  marketing: "MKT",
  design: "DGN",
  admin: "ADM",
};

const assetTypeGenerator: { [key: string]: string } = {
  laptop: "LPT",
  desktop: "DPT",
  mobile: "MBL",
  monitor: "MON",
  keyboard: "KBD",
  mouse: "MUS",
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
    "TF" +
    departmentGenerator[department] +
    findYear(joining_date) +
    make3digit(departmentSerial);

  return userId;
};

// asset id generator
export const generateAssetId = (assetType: string, assetSerial: number) => {
  const assetId =
    "TF_" + assetTypeGenerator[assetType] + "_" + assetSerial.toString();
  return assetId;
};
