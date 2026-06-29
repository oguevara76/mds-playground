import { Pipe, PipeTransform } from '@angular/core';

export function catalogBlockHeadTitle(title: string): string {
  return `❖ ${title.toUpperCase()}`;
}

@Pipe({
  name: 'catalogBlockHeadTitle',
  standalone: true,
})
export class CatalogBlockHeadTitlePipe implements PipeTransform {
  transform(title: string): string {
    return catalogBlockHeadTitle(title);
  }
}
