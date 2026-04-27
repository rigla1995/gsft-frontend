import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dateFr', standalone: true })
export class DateFrPipe implements PipeTransform {
  transform(
    value: string | Date | null | undefined,
    format: 'short' | 'long' | 'datetime' = 'short',
  ): string {
    if (!value) return '—';
    const date = typeof value === 'string' ? new Date(value) : value;
    let opts: Intl.DateTimeFormatOptions;
    if (format === 'datetime') {
      opts = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    } else if (format === 'long') {
      opts = { day: 'numeric', month: 'long', year: 'numeric' };
    } else {
      opts = { day: '2-digit', month: '2-digit', year: 'numeric' };
    }
    return date.toLocaleDateString('fr-FR', opts);
  }
}
