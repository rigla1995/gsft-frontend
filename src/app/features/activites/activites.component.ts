import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-activites',
  standalone: true,
  imports: [TranslateModule, MatCardModule],
  template: `
    <h1 class="page-title">{{ 'NAV.ACTIVITES' | translate }}</h1>
    <mat-card>
      <mat-card-content>
        <p>Gestion des activités (franchise / distinct) — module en cours de développement.</p>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`.page-title { font-size: 1.5rem; font-weight: 600; margin-bottom: 24px; color: #1565C0; }`],
})
export class ActivitesComponent {}
