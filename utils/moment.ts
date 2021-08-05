import "moment-timezone";
import moment from "moment";
import { CustomHelpers } from "@hapi/joi";

export function convertDateToTimeStamp(date: string) {
  let formatDate = moment(date).format();
  let timestamp = moment(formatDate).format("X");
  return timestamp;
}

export function getTwoYearsOldTimeStamp() {
  let currentDate = new Date() as any;
  currentDate.setFullYear(currentDate.getFullYear() - 2);
  currentDate.setHours(0, 0, 0);
  currentDate.setMilliseconds(0);
  return currentDate;
}

export const dataValidator = (value: string, helpers: CustomHelpers) => {
  const p = moment.utc(value).utcOffset(330).valueOf();
  return p;
};
