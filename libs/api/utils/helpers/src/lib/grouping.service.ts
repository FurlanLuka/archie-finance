export class GroupingHelper {
  public static groupBy<T extends object>(
    data: T[],
    groupByPropertyFn: (elt: T) => string,
  ): Record<string, T[]> {
    return data.reduce((grouped: Record<string, T[]>, element: T) => {
      const groupProperty: string = groupByPropertyFn(element);

      if (grouped[groupProperty] === undefined) {
        grouped[groupProperty] = [element];
      } else {
        grouped[groupProperty].push(element);
      }

      return grouped;
    }, {});
  }

  public static mapBy<T extends object>(
    data: T[],
    groupByPropertyFn: (elt: T) => string,
  ): Record<string, T> {
    return data.reduce((grouped: Record<string, T>, element: T) => {
      const groupProperty: string = groupByPropertyFn(element);

      grouped[groupProperty] = element;

      return grouped;
    }, {});
  }
}
