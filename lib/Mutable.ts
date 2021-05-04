
// eslint-disable-next-line @typescript-eslint/ban-types
export type Mutable<T extends object> = {
    -readonly [K in keyof T]: T[K];
  };