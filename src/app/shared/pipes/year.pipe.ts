import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'year',
  standalone: true
})
export class YearPipe implements PipeTransform {
  transform(dateString: string): number | string {
    if (!dateString) return 'N/A';
    try {
      const year = new Date(dateString).getFullYear();
      return year;
    } catch {
      return 'N/A';
    }
  }
}
