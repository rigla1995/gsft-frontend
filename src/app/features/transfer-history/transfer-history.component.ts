import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-transfer-history',
  standalone: true,
  imports: [TranslateModule, MatCardModule],
  template: `
    <h1 class="page-title">{{ 'NAV.TRANSFER_HISTORY' | translate }}</h1>
    <mat-card>
      <mat-card-content>
        <p>Historique des transferts (pagination 10/page, notes) — module en cours de développement.</p>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`.page-title { font-size: 1.5rem; font-weight: 600; margin-bottom: 24px; color: #1565C0; }`],
})
export class TransferHistoryComponent {}
