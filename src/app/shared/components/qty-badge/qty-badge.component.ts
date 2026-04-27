import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-qty-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="qty-badge" [ngClass]="badgeClass">{{ value }}</span>
  `,
  styles: [`
    .qty-badge {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.875rem;
    }
    .qty-red    { background: #fdecea; color: #c62828; }
    .qty-amber  { background: #fff8e1; color: #e65100; }
    .qty-green  { background: #e8f5e9; color: #2e7d32; }
  `],
})
export class QtyBadgeComponent {
  @Input() value: number = 0;

  get badgeClass(): string {
    if (this.value === 0) return 'qty-red';
    if (this.value < 5) return 'qty-amber';
    return 'qty-green';
  }
}
