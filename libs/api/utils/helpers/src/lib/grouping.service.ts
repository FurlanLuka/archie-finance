import { Group, GroupMap } from './helper.interfaces';

export class GroupingHelper {
  public static groupBy<T extends object>(
    data: T[],
    groupByPropertyFn: (elt: T) => string,
  ): Group<T> {
    return data.reduce((grouped: Group<T>, element: T) => {
      const groupProperty: string = groupByPropertyFn(element);

      const existingElements: T[] | undefined = grouped[groupProperty];

      if (existingElements === undefined) {
        grouped[groupProperty] = [element];
      } else {
        existingElements.push(element);
      }

      return grouped;
    }, {});
  }

  public static mapBy<T extends object>(
    data: T[],
    groupByPropertyFn: (elt: T) => string,
  ): GroupMap<T> {
    return data.reduce((grouped: GroupMap<T>, element: T) => {
      const groupProperty: string = groupByPropertyFn(element);

      grouped[groupProperty] = element;

      return grouped;
    }, {});
  }
}
