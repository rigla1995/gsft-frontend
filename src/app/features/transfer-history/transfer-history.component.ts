import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { StockService } from '../../core/services/stock.service';
import { ActiviteService, Activite } from '../../core/services/activite.service';
import { Transfert } from '../../core/models/stock.model';
import { DateFrPipe } from '../../shared/pipes/date-fr.pipe';
import { NoteDialogComponent } from './note-dialog.component';

@Component({
  selector: 'app-transfer-history',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule, MatTableModule, MatPaginatorModule, MatFormFieldModule,
    MatSelectModule, MatInputModule, MatButtonModule, MatIconModule,
    MatTooltipModule, MatProgressSpinnerModule, MatDialogModule, MatChipsModule,
    DateFrPipe,
  ],
  templateUrl: './transfer-history.component.html',
  styleUrl: './transfer-history.component.scss',
})
export class TransferHistoryComponent implements OnInit {
  private stockSvc = inject(StockService);
  private activiteSvc = inject(ActiviteService);
  private dialog = inject(MatDialog);

  activites = signal<Activite[]>([]);
  transferts = signal<Transfert[]>([]);
  total = signal(0);
  loading = signal(false);

  page = signal(0);
  pageSize = 10;

  filterActiviteId = signal('');
  filterIngredient = signal('');

  columns = ['date', 'ingredient', 'source', 'dest', 'quantite', 'note'];

  unitTotals = computed(() => {
    const map = new Map<string, { unite: string; total: number }>();
    for (const t of this.transferts()) {
      const unite = t.ingredient?.unite?.symbole ?? '?';
      const key = unite;
      const existing = map.get(key);
      if (existing) {
        existing.total += t.quantite;
      } else {
        map.set(key, { unite, total: t.quantite });
      }
    }
    return Array.from(map.values());
  });

  ngOnInit(): void {
    this.activiteSvc.getActivites().subscribe(list => this.activites.set(list));
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.stockSvc.getTransferts({
      activiteId: this.filterActiviteId() || undefined,
      page: this.page(),
      pageSize: this.pageSize,
    }).subscribe({
      next: resp => {
        this.transferts.set(resp.data);
        this.total.set(resp.total);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onPage(event: PageEvent): void {
    this.page.set(event.pageIndex);
    this.load();
  }

  applyFilters(): void {
    this.page.set(0);
    this.load();
  }

  clearFilters(): void {
    this.filterActiviteId.set('');
    this.filterIngredient.set('');
    this.page.set(0);
    this.load();
  }

  openNote(note: string): void {
    this.dialog.open(NoteDialogComponent, {
      data: { note },
      width: '400px',
    });
  }

  filteredRows = computed(() => {
    const ing = this.filterIngredient().toLowerCase();
    if (!ing) return this.transferts();
    return this.transferts().filter(t => t.ingredient?.nom.toLowerCase().includes(ing));
  });
}
