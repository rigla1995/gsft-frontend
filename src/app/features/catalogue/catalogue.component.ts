import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [TranslateModule, MatCardModule],
  template: `
    <h1 class="page-title">{{ 'NAV.CATALOGUE' | translate }}</h1>
    <mat-card>
      <mat-card-content>
        <p>Catalogue d'ingrédients — module en cours de développement.</p>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`.page-title { font-size: 1.5rem; font-weight: 600; margin-bottom: 24px; color: #1565C0; }`],
})
export class CatalogueComponent {}
