import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StockService } from '../../core/services/stock.service';
import { ActiviteService, Activite } from '../../core/services/activite.service';
import { StockItem } from '../../core/models/stock.model';

@Component({
  selector: 'app-labo-stock',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatButtonModule, MatIconModule,
    MatCardModule, MatTooltipModule,
  ],
  template: `
    <div class="page-container">
      <h1 class="page-title">Stock Labo</h1>

      @if (labo()) {
        <div class="labo-info">
          <mat-icon>science</mat-icon>
          <span>{{ labo()!.nom }}</span>
        </div>

        <div class="table-wrapper">
          <table mat-table [dataSource]="stock()">
            <ng-container matColumnDef="ingredient">
              <th mat-header-cell *matHeaderCellDef>Ingrédient</th>
              <td mat-cell *matCellDef="let row">{{ row.ingredient?.name ?? '—' }}</td>
            </ng-container>
            <ng-container matColumnDef="categorie">
              <th mat-header-cell *matHeaderCellDef>Catégorie</th>
              <td mat-cell *matCellDef="let row">{{ row.ingredient?.categorie?.name ?? '—' }}</td>
            </ng-container>
            <ng-container matColumnDef="quantite">
              <th mat-header-cell *matHeaderCellDef>Quantité</th>
              <td mat-cell *matCellDef="let row">
                <span [class]="row.isAlerte ? 'qty-red' : 'qty-green'">
                  {{ row.quantite }} {{ row.ingredient?.unite?.symbol }}
                </span>
              </td>
            </ng-container>
            <ng-container matColumnDef="seuil">
              <th mat-header-cell *matHeaderCellDef>Seuil min.</th>
              <td mat-cell *matCellDef="let row">{{ row.seuilMinimum }} {{ row.ingredient?.unite?.symbol }}</td>
            </ng-container>
            <ng-container matColumnDef="alerte">
              <th mat-header-cell *matHeaderCellDef>Alerte</th>
              <td mat-cell *matCellDef="let row">
                @if (row.isAlerte) {
                  <mat-icon color="warn" matTooltip="Stock sous le seuil minimum">warning</mat-icon>
                }
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;" [class.row-alerte]="row.isAlerte"></tr>
            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell no-data" colspan="5">Aucun stock labo disponible</td>
            </tr>
          </table>
        </div>
      } @else {
        <mat-card>
          <mat-card-content>
            <p>Aucun laboratoire configuré pour ce compte.</p>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .page-title { font-size: 1.5rem; font-weight: 600; margin-bottom: 16px; color: #1565C0; }
    .labo-info { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; font-size: 1rem; font-weight: 500; color: #555; mat-icon { color: #1565C0; } }
    .table-wrapper { overflow-x: auto; }
    .no-data { padding: 24px; text-align: center; color: #999; }
    .row-alerte { background: #fff8f8; }
  `],
})
export class LaboStockComponent implements OnInit {
  private stockSvc = inject(StockService);
  private activiteSvc = inject(ActiviteService);

  labo = signal<Activite | null>(null);
  stock = signal<StockItem[]>([]);
  columns = ['ingredient', 'categorie', 'quantite', 'seuil', 'alerte'];

  ngOnInit(): void {
    this.activiteSvc.getActivites().subscribe(list => {
      const laboActivite = list.find(a => a.type === 'LABO');
      if (laboActivite) {
        this.labo.set(laboActivite);
        this.stockSvc.getStock(laboActivite.id).subscribe(s => this.stock.set(s));
      }
    });
  }
}
