declare module 'js-yaml' {
  const yaml: {
    load: (str: string) => unknown;
    dump: (obj: unknown, options?: { indent?: number; lineWidth?: number }) => string;
  };
  export default yaml;
}
