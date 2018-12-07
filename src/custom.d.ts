declare module "*.svg" {
  const content: any;
  export default content;
}

declare module "*.json" {
  const value: any;
  export default value;
}

declare module "*.css" {
  const content: {
    [propName: string]: any
  };
  export default content;
}

declare module "*.less" {
  const content: {
    [propName: string]: any
  };
  export default content;
}
