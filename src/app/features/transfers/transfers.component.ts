import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StockService } from '../../core/services/stock.service';
import { ActiviteService, Activite } from '../../core/services/activite.service';
import { CatalogueService } from '../../core/services/catalogue.service';
import { StockItem } from '../../core/models/stock.model';
import { Ingredient, Categorie } from '../../core/models/catalogue.model';

@Component({
  selector: 'app-transfers',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatDividerModule, MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './transfers.component.html',
  styleUrl: './transfers.component.scss',
})
export class TransfersComponent implements OnInit {
  private stockSvc = inject(StockService);
  private activiteSvc = inject(ActiviteService);
  private catSvc = inject(CatalogueService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  labo = signal<Activite | null>(null);
  activitesDest = signal<Activite[]>([]);
  laboStock = signal<StockItem[]>([]);
  categories = signal<Categorie[]>([]);

  loading = signal(false);
  submitting = signal(false);

  categoryFilter = signal('');
  nameFilter = signal('');

  filteredStock = computed(() => {
    let items = this.laboStock();
    const cat = this.categoryFilter();
    const name = this.nameFilter().toLowerCase();
    if (cat) items = items.filter(i => i.ingredient?.categorieId === cat);
    if (name) items = items.filter(i => i.ingredient?.name.toLowerCase().includes(name));
    return items;
  });

  selectedStockItem = signal<StockItem | null>(null);

  form = this.fb.nonNullable.group({
    ingredientId: ['', Validators.required],
    activiteDestId: ['', Validators.required],
    quantite: [1, [Validators.required, Validators.min(0.001)]],
    note: [''],
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.activiteSvc.getActivites().subscribe({
      next: list => {
        const labo = list.find(a => a.type === 'LABO') ?? null;
        this.labo.set(labo);
        this.activitesDest.set(list.filter(a => a.type !== 'LABO'));
        if (labo) {
          this.stockSvc.getStock(labo.id).subscribe({
            next: stock => { this.laboStock.set(stock); this.loading.set(false); },
            error: () => this.loading.set(false),
          });
        } else {
          this.loading.set(false);
        }
      },
      error: () => this.loading.set(false),
    });

    this.catSvc.getCategories().subscribe(cats => this.categories.set(cats));
  }

  selectIngredient(item: StockItem): void {
    this.selectedStockItem.set(item);
    this.form.patchValue({ ingredientId: item.ingredientId });
  }

  clearFilters(): void {
    this.categoryFilter.set('');
    this.nameFilter.set('');
  }

  submit(): void {
    if (this.form.invalid) return;
    const { ingredientId, activiteDestId, quantite, note } = this.form.getRawValue();
    const max = this.selectedStockItem()?.quantite ?? 0;
    if (quantite > max) {
      this.snackBar.open(`Quantité insuffisante (max ${max})`, 'Fermer', { duration: 4000 });
      return;
    }
    this.submitting.set(true);
    this.stockSvc.transferer({ ingredientId, activiteDestId, quantite, note: note || undefined }).subscribe({
      next: () => {
        this.snackBar.open('Transfert effectué avec succès', 'OK', { duration: 3000 });
        this.form.reset({ ingredientId: '', activiteDestId: '', quantite: 1, note: '' });
        this.selectedStockItem.set(null);
        this.submitting.set(false);
        this.load();
      },
      error: () => {
        this.snackBar.open('Erreur lors du transfert', 'Fermer', { duration: 3000 });
        this.submitting.set(false);
      },
    });
  }

  stockColor(item: StockItem): string {
    if (item.quantite === 0) return 'qty-red';
    if (item.quantite < 5) return 'qty-amber';
    return 'qty-green';
  }
}
