export function calculateRemainingLeave(
  joinDate: Date,
  leaveAllottedPerYear: number
): number {
  // Convert joinDate to a Date object
  const joinDateObj = new Date(joinDate);
  const currentYear = joinDateObj.getFullYear();

  // Calculate the total number of days in the year
  const startOfYear = new Date(currentYear, 0, 1);
  const endOfYear = new Date(currentYear, 11, 31);
  const totalDaysInYear =
    (endOfYear.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24) + 1;

  // Calculate the number of days worked since join date till end of year
  const daysWorked =
    (endOfYear.getTime() - joinDateObj.getTime()) / (1000 * 60 * 60 * 24) + 1;

  // Calculate remaining leave based on proportional days worked
  const remainingLeave = (daysWorked / totalDaysInYear) * leaveAllottedPerYear;

  // Return remaining leave rounded to two decimal places
  return Math.round(remainingLeave * 100) / 100;
}
