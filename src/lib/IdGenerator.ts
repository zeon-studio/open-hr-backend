const departmentShortName: { [key: string]: string } = {
  development: "DEV",
  marketing: "MKT",
  design: "DES",
  admin: "ADM",
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
    departmentShortName[department] +
    findYear(joining_date) +
    make3digit(departmentSerial);

  return userId;
};

// asset id generator
export const generateAssetId = (assetType: string, assetSerial: string) => {
  const assetId = "TF" + assetType + assetSerial;
  return assetId;
};
