import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dateFr', standalone: true })
export class DateFrPipe implements PipeTransform {
  transform(value: string | Date | null | undefined, format: 'short' | 'long' | 'datetime' = 'short'): string {
    if (!value) return '—';
    const date = typeof value === 'string' ? new Date(value) : value;
    const opts: Intl.DateTimeFormatOptions =
      format === 'datetime'
        ? { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }
        : format === 'long'
          ? { day: 'long', month: 'long', year: 'numeric' }
          : { day: '2-digit', month: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('fr-FR', opts);
  }
}
