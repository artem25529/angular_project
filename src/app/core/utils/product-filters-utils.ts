import { AppliedFilter } from '@product/models/applied-filter';
import { ProductFilters } from '@product/models/product-filters';

export function createAppliedFiltersFromProductFilters(
  productFilters: ProductFilters,
): AppliedFilter[] {
  const result: AppliedFilter[] = [];

  const keys = Object.keys(productFilters) as Array<keyof typeof productFilters>;

  keys.forEach((key) => {
    const val = productFilters[key];

    if (!val) {
      return;
    }

    const keyWSpaces = camelToSpaces(key);

    if (val.includes('|')) {
      const values = val.split('|');

      if (values[0]) {
        result.push({
          name: `${key}.0`,
          label: `min ${keyWSpaces}: ${values[0]}`,
        });
      }

      if (values[1]) {
        result.push({
          name: `${key}.1`,
          label: `max ${keyWSpaces}: ${values[1]}`,
        });
      }
    } else {
      const label = val !== 'yes' ? `${keyWSpaces}: ${val}` : keyWSpaces;

      result.push({
        name: key,
        label,
      });
    }
  });

  return result;
}

export function getDefaultValue(type: string): any {
  switch (type) {
    case 'string':
      return '';
    case 'number':
      return 0;
    case 'boolean':
      return false;
    default:
      return null;
  }
}

export function camelToSpaces(source: string): string {
  return source.replace(/([A-Z])/g, ' $1').toLocaleLowerCase();
}
