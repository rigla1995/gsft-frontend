import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TranslateModule, MatCardModule, MatIconModule],
  template: `
    <h1 class="page-title">{{ 'NAV.DASHBOARD' | translate }}</h1>
    <div class="summary-grid">
      @for (card of summaryCards; track card.label) {
        <mat-card class="summary-card" [style.borderTop]="'4px solid ' + card.color">
          <mat-card-content>
            <div class="card-icon" [style.color]="card.color">
              <mat-icon>{{ card.icon }}</mat-icon>
            </div>
            <div class="card-value">—</div>
            <div class="card-label">{{ card.label }}</div>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .page-title { font-size: 1.5rem; font-weight: 600; margin-bottom: 24px; color: #1565C0; }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }
    .summary-card { border-radius: 8px; }
    .card-icon { font-size: 2rem; margin-bottom: 8px; }
    .card-value { font-size: 1.8rem; font-weight: 700; color: #333; }
    .card-label { color: #666; font-size: 0.9rem; margin-top: 4px; }
  `],
})
export class DashboardComponent {
  summaryCards = [
    { label: 'Activités', icon: 'store', color: '#1565C0' },
    { label: 'Ingrédients', icon: 'menu_book', color: '#2e7d32' },
    { label: 'Transferts ce mois', icon: 'swap_horiz', color: '#e65100' },
    { label: 'Alertes stock', icon: 'warning', color: '#c62828' },
  ];
}
