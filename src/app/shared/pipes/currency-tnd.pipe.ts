import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currencyTnd', standalone: true })
export class CurrencyTndPipe implements PipeTransform {
  transform(value: number | null | undefined, decimals = 3): string {
    if (value == null) return '—';
    return `${value.toLocaleString('fr-TN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })} DT`;
  }
}
