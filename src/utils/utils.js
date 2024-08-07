  // export const timezoneCodes = [
  //   { value: "Pacific/Midway", label: "(UTC-11:00) Pacific/Midway Time" },
  //   { value: "Pacific/Honolulu", label: "(UTC-10:00) Pacific/Honolulu Time" },
  //   { value: "America/Anchorage", label: "(UTC-09:00) Alaska Time" },
  //   { value: "America/Los_Angeles", label: "(UTC-08:00) Pacific Time" },
  //   { value: "America/Denver", label: "(UTC-07:00) Mountain Time" },
  //   { value: "America/Chicago", label: "(UTC-06:00) Central Time" },
  //   { value: "America/New_York", label: "(UTC-05:00) Eastern Time" },
  //   { value: "America/Halifax", label: "(UTC-04:00) Atlantic Time" },
  //   { value: "America/Buenos_Aires", label: "(UTC-03:00) Argentina Time" },
  //   { value: "Atlantic/Azores", label: "(UTC-01:00) Azores Time" },
  //   { value: "UTC", label: "(UTC+00:00) Coordinated Universal Time" },
  //   { value: "Europe/Paris", label: "(UTC+01:00) Central European Time" },
  //   { value: "Europe/Moscow", label: "(UTC+03:00) Moscow Time" },
  //   { value: "Asia/Dubai", label: "(UTC+04:00) Gulf Standard Time" },
  //   { value: "Asia/Karachi", label: "(UTC+05:00) Kazakhstan Standard Time" },
  //   { value: "Asia/Dhaka", label: "(UTC+06:00) Bangladesh Standard Time" },
  //   { value: "Asia/Jakarta", label: "(UTC+07:00) Western Indonesia Time" },
  //   { value: "Asia/Shanghai", label: "(UTC+08:00) China Standard Time" },
  //   { value: "Asia/Tokyo", label: "(UTC+09:00) Japan Standard Time" },
  //   { value: "Australia/Sydney", label: "(UTC+10:00) Eastern Australia Time" },
  //   { value: "Pacific/Noumea", label: "(UTC+11:00) New Caledonia Time" },
  //   {
  //     value: "Pacific/Auckland",
  //     label: "(UTC+12:00) New Zealand Standard Time",
  //   },
  //   { value: "Pacific/Tongatapu", label: "(UTC+13:00) Tonga Time" },
  // ];
import moment from "moment-timezone";


  export const timezoneCodes = moment.tz.names().map((zone) => {
    const offset = moment.tz(zone).utcOffset();
    const hoursOffset = Math.floor(offset / 60);
    const minutesOffset = Math.abs(offset % 60);
    const label = `(UTC${hoursOffset >= 0 ? "+" : ""}${hoursOffset}:${
      minutesOffset === 0 ? "00" : minutesOffset.toString().padStart(2, "0")
    }) ${zone}`;

    return {
      value: zone,
      label: label,
    };
  });
