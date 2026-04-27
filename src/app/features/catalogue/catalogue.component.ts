import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { CatalogueService } from '../../core/services/catalogue.service';
import { Categorie, Domaine, Ingredient, PaginatedResponse, Unite } from '../../core/models/catalogue.model';
import { CurrencyTndPipe } from '../../shared/pipes/currency-tnd.pipe';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatTabsModule, MatTableModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule, MatPaginatorModule,
    MatTooltipModule, MatCardModule, CurrencyTndPipe,
  ],
  templateUrl: './catalogue.component.html',
  styleUrl: './catalogue.component.scss',
})
export class CatalogueComponent implements OnInit {
  private svc = inject(CatalogueService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  unites = signal<Unite[]>([]);
  domaines = signal<Domaine[]>([]);
  categories = signal<Categorie[]>([]);
  ingredients = signal<Ingredient[]>([]);
  ingTotal = signal(0);
  ingSearch = signal('');
  ingCategorieFilter = signal('');
  ingDomaineFilter = signal('');
  ingPage = 0;
  ingPageSize = 10;

  editingUnite = signal<Unite | null>(null);
  editingDomaine = signal<Domaine | null>(null);
  editingCategorie = signal<Categorie | null>(null);
  editingIngredient = signal<Ingredient | null>(null);
  showIngredientForm = signal(false);

  ingColumns = ['nom', 'categorie', 'unite', 'prix', 'actions'];

  uniteForm = this.fb.group({ nom: ['', Validators.required], symbole: ['', Validators.required] });
  domaineForm = this.fb.group({ nom: ['', Validators.required] });
  categorieForm = this.fb.group({ nom: ['', Validators.required], domaineId: [''] });
  ingredientForm = this.fb.group({
    nom: ['', Validators.required],
    categorieId: ['', Validators.required],
    uniteId: ['', Validators.required],
    prixUnitaire: [null as number | null],
  });

  ngOnInit(): void {
    this.loadReferentiels();
    this.loadIngredients();
  }

  loadReferentiels(): void {
    this.svc.getUnites().subscribe(u => this.unites.set(u));
    this.svc.getDomaines().subscribe(d => this.domaines.set(d));
    this.svc.getCategories().subscribe(c => this.categories.set(c));
  }

  loadIngredients(): void {
    this.svc.getIngredients({
      search: this.ingSearch() || undefined,
      categorieId: this.ingCategorieFilter() || undefined,
      domaineId: this.ingDomaineFilter() || undefined,
      page: this.ingPage,
      pageSize: this.ingPageSize,
    }).subscribe((res: PaginatedResponse<Ingredient>) => {
      this.ingredients.set(res.data);
      this.ingTotal.set(res.total);
    });
  }

  onIngSearch(e: Event): void { this.ingSearch.set((e.target as HTMLInputElement).value); this.ingPage = 0; this.loadIngredients(); }
  onIngCategorieFilter(val: string): void { this.ingCategorieFilter.set(val); this.ingPage = 0; this.loadIngredients(); }
  onIngDomaineFilter(val: string): void { this.ingDomaineFilter.set(val); this.ingPage = 0; this.loadIngredients(); }
  resetIngFilters(): void { this.ingSearch.set(''); this.ingCategorieFilter.set(''); this.ingDomaineFilter.set(''); this.ingPage = 0; this.loadIngredients(); }
  onIngPage(e: PageEvent): void { this.ingPage = e.pageIndex; this.ingPageSize = e.pageSize; this.loadIngredients(); }

  openIngredientForm(ing?: Ingredient): void {
    this.editingIngredient.set(ing ?? null);
    this.ingredientForm.reset({ nom: ing?.nom ?? '', categorieId: ing?.categorieId ?? '', uniteId: ing?.uniteId ?? '', prixUnitaire: ing?.prixUnitaire ?? null });
    this.showIngredientForm.set(true);
  }
  closeIngredientForm(): void { this.showIngredientForm.set(false); this.editingIngredient.set(null); }
  saveIngredient(): void {
    if (this.ingredientForm.invalid) return;
    const v = this.ingredientForm.value as Partial<Ingredient>;
    const obs = this.editingIngredient() ? this.svc.updateIngredient(this.editingIngredient()!.id, v) : this.svc.createIngredient(v);
    obs.subscribe({ next: () => { this.snackBar.open('Enregistré', 'Fermer', { duration: 2000 }); this.closeIngredientForm(); this.loadIngredients(); } });
  }
  deleteIngredient(ing: Ingredient): void {
    if (!confirm('Supprimer "' + ing.nom + '" ?')) return;
    this.svc.deleteIngredient(ing.id).subscribe({ next: () => { this.snackBar.open('Supprimé', 'Fermer', { duration: 2000 }); this.loadIngredients(); } });
  }

  editUnite(u: Unite): void { this.editingUnite.set(u); this.uniteForm.patchValue(u); }
  cancelEditUnite(): void { this.editingUnite.set(null); this.uniteForm.reset(); }
  saveUnite(): void {
    if (this.uniteForm.invalid) return;
    const v = this.uniteForm.value as Partial<Unite>;
    const obs = this.editingUnite() ? this.svc.updateUnite(this.editingUnite()!.id, v) : this.svc.createUnite(v);
    obs.subscribe({ next: () => { this.snackBar.open('Enregistré', 'Fermer', { duration: 2000 }); this.cancelEditUnite(); this.loadReferentiels(); } });
  }
  deleteUnite(u: Unite): void {
    if (!confirm('Supprimer "' + u.nom + '" ?')) return;
    this.svc.deleteUnite(u.id).subscribe({ next: () => { this.snackBar.open('Supprimé', 'Fermer', { duration: 2000 }); this.loadReferentiels(); } });
  }

  editDomaine(d: Domaine): void { this.editingDomaine.set(d); this.domaineForm.patchValue(d); }
  cancelEditDomaine(): void { this.editingDomaine.set(null); this.domaineForm.reset(); }
  saveDomaine(): void {
    if (this.domaineForm.invalid) return;
    const v = this.domaineForm.value as Partial<Domaine>;
    const obs = this.editingDomaine() ? this.svc.updateDomaine(this.editingDomaine()!.id, v) : this.svc.createDomaine(v);
    obs.subscribe({ next: () => { this.snackBar.open('Enregistré', 'Fermer', { duration: 2000 }); this.cancelEditDomaine(); this.loadReferentiels(); } });
  }
  deleteDomaine(d: Domaine): void {
    if (!confirm('Supprimer "' + d.nom + '" ?')) return;
    this.svc.deleteDomaine(d.id).subscribe({ next: () => { this.snackBar.open('Supprimé', 'Fermer', { duration: 2000 }); this.loadReferentiels(); } });
  }

  editCategorie(c: Categorie): void { this.editingCategorie.set(c); this.categorieForm.patchValue({ nom: c.nom, domaineId: c.domaineId ?? '' }); }
  cancelEditCategorie(): void { this.editingCategorie.set(null); this.categorieForm.reset(); }
  saveCategorie(): void {
    if (this.categorieForm.invalid) return;
    const v = this.categorieForm.value as Partial<Categorie>;
    const obs = this.editingCategorie() ? this.svc.updateCategorie(this.editingCategorie()!.id, v) : this.svc.createCategorie(v);
    obs.subscribe({ next: () => { this.snackBar.open('Enregistré', 'Fermer', { duration: 2000 }); this.cancelEditCategorie(); this.loadReferentiels(); } });
  }
  deleteCategorie(c: Categorie): void {
    if (!confirm('Supprimer "' + c.nom + '" ?')) return;
    this.svc.deleteCategorie(c.id).subscribe({ next: () => { this.snackBar.open('Supprimé', 'Fermer', { duration: 2000 }); this.loadReferentiels(); } });
  }
}
