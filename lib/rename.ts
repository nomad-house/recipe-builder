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
function capitalizeFirstLetter(segment: string): string {
  return segment[0].toUpperCase() + segment.slice(1);
}
function lowercaseFirstLetter(segment: string): string {
  return segment[0].toLowerCase() + segment.slice(1);
}
function toKebab(str: string): string {
  return splitString(str)
    .join("-")
    .toLowerCase();
}
function toPascal(str: string): string {
  return splitString(str)
    .map(capitalizeFirstLetter)
    .join("");
}
function toCamel(str: string): string {
  return lowercaseFirstLetter(toPascal(str));
}
export { toKebab, toCamel, toPascal };
