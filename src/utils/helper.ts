export const capitalize = ([first, ...rest]: string, lowerRest = false) =>
  first.toUpperCase() +
  (lowerRest ? rest.join('').toLowerCase() : rest.join(''));

export function paginate({
  data,
  limit,
  page,
  totalItems,
}: {
  data: any[];
  limit: number;
  page: number;
  totalItems: number;
}) {
  return {
    items: data,
    pagination: {
      page,
      totalPage: Math.ceil(totalItems / limit),
      limit,
      total: totalItems,
    },
  };
}

export const getPropertiesIfExists = (obj: any) => {
  const result: any = {};
  for (const key in obj) {
    const value = obj[key];
    if (value !== undefined && value !== null) {
      result[key] = value;
    }
  }
  return result;
};
