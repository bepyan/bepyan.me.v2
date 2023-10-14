export const sortDateDesc = (a: any, b: any) => {
  return new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf();
};
