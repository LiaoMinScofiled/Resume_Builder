declare module 'papaparse' {
  interface ParseResult<T> {
    data: T[];
    errors: Array<{ message: string }>;
  }
  const Papa: {
    parse: <T>(str: string, options?: { header?: boolean; skipEmptyLines?: boolean; dynamicTyping?: boolean }) => ParseResult<T>;
    unparse: (data: unknown, options?: { quotes?: boolean }) => string;
  };
  export default Papa;
}
