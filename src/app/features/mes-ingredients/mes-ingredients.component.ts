import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { StockService } from '../../core/services/stock.service';
import { ActiviteService, Activite } from '../../core/services/activite.service';
import { CatalogueService } from '../../core/services/catalogue.service';
import { Ingredient } from '../../core/models/catalogue.model';

@Component({
  selector: 'app-mes-ingredients',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatFormFieldModule, MatSelectModule, MatButtonModule, MatIconModule,
    MatCheckboxModule, MatInputModule, MatCardModule, MatChipsModule,
  ],
  templateUrl: './mes-ingredients.component.html',
  styleUrl: './mes-ingredients.component.scss',
})
export class MesIngredientsComponent implements OnInit {
  private stockSvc = inject(StockService);
  private activiteSvc = inject(ActiviteService);
  private catSvc = inject(CatalogueService);
  private snackBar = inject(MatSnackBar);

  activites = signal<Activite[]>([]);
  selectedActiviteId = signal<string>('');
  allIngredients = signal<Ingredient[]>([]);
  filteredIngredients = signal<Ingredient[]>([]);
  assignedIds = signal<Set<string>>(new Set());
  searchText = signal('');

  ngOnInit(): void {
    this.activiteSvc.getActivites().subscribe(a => {
      this.activites.set(a);
      if (a.length > 0) { this.selectedActiviteId.set(a[0].id); this.loadIngredients(); }
    });
    this.catSvc.getAllIngredients().subscribe(i => { this.allIngredients.set(i); this.applyFilter(); });
  }

  loadIngredients(): void {
    const id = this.selectedActiviteId();
    if (!id) return;
    this.stockSvc.getAssignedIngredients(id).subscribe(ids => this.assignedIds.set(new Set(ids)));
  }

  onActiviteChange(id: string): void {
    this.selectedActiviteId.set(id);
    this.loadIngredients();
  }

  onSearch(val: string): void {
    this.searchText.set(val);
    this.applyFilter();
  }

  applyFilter(): void {
    const s = this.searchText().toLowerCase();
    this.filteredIngredients.set(
      this.allIngredients().filter(i => !s || i.name.toLowerCase().includes(s))
    );
  }

  toggle(id: string): void {
    this.assignedIds.update(set => {
      const next = new Set(set);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  isAssigned(id: string): boolean {
    return this.assignedIds().has(id);
  }

  save(): void {
    this.stockSvc.assignIngredients({
      activiteId: this.selectedActiviteId(),
      ingredientIds: Array.from(this.assignedIds()),
    }).subscribe({
      next: () => this.snackBar.open('Ingrédients mis à jour', 'Fermer', { duration: 2000 }),
      error: () => this.snackBar.open('Erreur', 'Fermer', { duration: 3000, panelClass: 'snack-error' }),
    });
  }
}
