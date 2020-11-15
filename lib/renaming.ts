const CAPITAL = /[A-Z]/g;
const hasCapital = (str: string) => CAPITAL.test(str);
const firstIsCapital = (str: string) => CAPITAL.test(str[0]);

const cases = ["camel", "pascal", "kebab", "snake"] as const;
type StringCase = typeof cases[number];

function splitString(str: string): string[] {
  let separator: undefined | string;
  const sanitized = str.replace(/[\s!@#$%^&*]/g, "");
  const camelsBrokenApart = sanitized.replace(/([a-z0-9])([A-Z])/g, "$1-$2");
  if (/_/.test(camelsBrokenApart)) separator = "_";
  if (/-/.test(camelsBrokenApart)) separator = "-";
  if (separator) {
    const segments: string[] = [];
    for (const segment of camelsBrokenApart.split(separator)) {
      segments.push(...splitString(segment));
    }
    return segments;
  }
  return [camelsBrokenApart];
}
export function capitalizeFirstLetter(segment: string): string {
  return segment[0].toUpperCase() + segment.slice(1);
}
export function lowercaseFirstLetter(segment: string): string {
  return segment[0].toLowerCase() + segment.slice(1);
}
export const renameTo = {
  kebab: (str: string): string =>
    splitString(str)
      .join("-")
      .toLowerCase(),
  pascal: (str: string): string =>
    splitString(str)
      .map(capitalizeFirstLetter)
      .join(""),
  camel: (str: string): string => lowercaseFirstLetter(renameTo.pascal(str))
};
